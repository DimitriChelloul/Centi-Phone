import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/core/services/products/product.service';
import { ReparationService } from '../../core/core/services/repairs/repair.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { UserService } from '../../core/core/services/auth/user.service'; // Import UserService

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  refurbishedDevices: any[] = [];
  devisData = { nom: '', email: '', probleme: '' };
  rdvData = { nom: '', email: '', date: '' };

  constructor(
    private router: Router,
    private productService: ProductService,
    private repairService: ReparationService,
    private userService: UserService 
  ) {}

  ngOnInit(): void {
    console.log('HomeComponent chargé');
    this.fetchProducts();
    this.fetchRefurbishedDevices();
  }

  async fetchProducts() { 
    
    this.productService.getAllProducts().subscribe({
      next: (data: any[]) => {
        this.products = data;
        console.log('Produits récupérés avec succès:', data);
      },
      error: (err: any) => console.error('Erreur lors de la récupération des produits:', err),
    });
  }

  async fetchRefurbishedDevices() {
   

    this.productService.getAllRefurbishedDevices().subscribe({
      next: (data: any[]) => {
        this.refurbishedDevices = data;
        console.log('Appareils reconditionnés récupérés avec succès:', data);
      },
      error: (err: any) => console.error('Erreur lors de la récupération des appareils reconditionnés:', err),
    });
  }

  // Redirige vers la page de devis
  redirectToDevis(): void {
    this.router.navigate(['/devis']);
  }

  // Redirige vers la page de rendez-vous
  redirectToRdv(): void {
    this.router.navigate(['/appointments']);
  }

  // Redirige vers la page de connexion
  redirectToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}