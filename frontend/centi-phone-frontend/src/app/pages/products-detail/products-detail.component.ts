import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-products-detail',
    standalone: true,
      imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
    templateUrl: './products-detail.component.html',
    styleUrl: './products-detail.component.css'
})
export class ProductsDetailComponent {

}
