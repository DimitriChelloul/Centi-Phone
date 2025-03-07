import { Component, OnInit } from '@angular/core';
import { ReparationService } from '../../core/core/services/repairs/repair.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { UserService } from '../../core/core/services/auth/user.service'; 
import { first } from 'rxjs';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'],
})
export class AppointmentComponent implements OnInit {
  appointmentData = {
    nom: '',
    email: '',
    dateRdv: '',
    description: '',
  };

  credentials = {
    email: '',
    motDePasse: '',
  };

  errorMessage: string = '';
  showLoginPrompt: boolean = false; // Affiche l'invite de connexion uniquement après soumission

  constructor(
    private router: Router,
    private repairService: ReparationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {}

  async submitAppointment() {
    try {
    // Vérifier l'état de connexion au moment de la soumission
    const isLoggedIn = await this.userService.isAuthenticated$.pipe(first()).toPromise(); 

    if (!isLoggedIn) {
      this.showLoginPrompt = true;
      return;
    }

    //const csrfToken = this.userService.getCsrfTokenFromStorage(); 
    const jwtToken = this.userService.getJwtToken();

    console.log("JWT Token récupéré :", jwtToken);

    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];

    console.log("CSRF Token récupéré :", csrfToken);

    if ( !jwtToken) {
      this.errorMessage = "Erreur d'authentification. Veuillez vous reconnecter.";
      return;
    }

   

    this.repairService.createRdv(this.appointmentData).subscribe({
      next: (response) => {
        console.log('Réponse succès:', response);
        alert('Votre rendez-vous a été enregistré avec succès !');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Erreur lors de la prise de rendez-vous', err);
        this.errorMessage = err.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
      },
    });
  } catch (error) {
    console.error('Erreur dans submitAppointment:', error);
    this.errorMessage = "Une erreur inattendue s'est produite.";
  }
  }

    /**
   * Connecte l'utilisateur après validation des identifiants
   */
    loginAndSubmit() {
      this.userService.login(this.credentials).subscribe({
        next: (response) => {
          // Stockez le JWT et relancez la prise de rendez-vous
          this.userService.setJwtToken(response.token);
          this.showLoginPrompt = false; // Masque le formulaire de connexion
          this.submitAppointment(); // Relance la prise de rendez-vous
        },
        error: (err) => {
          console.error('Erreur de connexion', err);
          this.errorMessage = 'Connexion échouée. Vérifiez vos identifiants.';
        },
      });
    }
  }

 

