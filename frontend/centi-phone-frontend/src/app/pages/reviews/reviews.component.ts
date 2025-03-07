import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-reviews',
    standalone: true,
      imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
    templateUrl: './reviews.component.html',
    styleUrl: './reviews.component.css'
})
export class ReviewsComponent {

}
