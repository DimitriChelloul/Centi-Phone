import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
})
export class HeaderComponent {
  constructor(private router: Router) {}

  // Méthode pour rediriger vers la page de connexion
  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}

