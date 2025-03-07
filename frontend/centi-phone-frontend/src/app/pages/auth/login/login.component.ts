import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserService } from '../../../core/core/services/auth/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  credentials = {
    email: '',
    motDePasse: '',
  };

  errorMessage: string = '';

  constructor(
    private router: Router,
    private userService: UserService 
  ) {}

  login(): void {
    this.userService.login(this.credentials).subscribe({
      next: (response) => {
        alert('Connexion réussie');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Erreur lors de la connexion', err);
        this.errorMessage = 'Email ou mot de passe incorrect.';
      },
    });
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}