import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-products',
    standalone: true,
      imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
    templateUrl: './products.component.html',
    styleUrl: './products.component.css'
})
export class ProductsComponent {

}
