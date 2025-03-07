import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/core/services/auth/user.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerData = {
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    telephone: '',
    adresse: '',
  };

  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  register(): void {
    if (!this.registerData.nom || !this.registerData.email || !this.registerData.motDePasse) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }
    
    const csrfToken = this.userService.getCsrfTokenFromCookie() || '';
    const httpOptions = {
      headers: new HttpHeaders({
        'X-CSRF-Token': csrfToken, // Use UserService
      }),
      withCredentials: true, // Important pour envoyer les cookies avec la requête
    };

    this.userService.register(this.registerData,csrfToken).subscribe({
      next: () => {
        console.log('Inscription réussie, redirection vers la page de connexion...');
        this.router.navigate(['/auth/login']); // Redirige vers la page de connexion après l'inscription
      },
      error: (err) => {
        console.error("Erreur lors de l'inscription", err);
        if (err.status === 400) {
          this.errorMessage = 'Un utilisateur avec cet email existe déjà.';
        } else {
          this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
        }
      },
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}