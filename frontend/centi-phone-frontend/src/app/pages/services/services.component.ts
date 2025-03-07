import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-services',
    standalone: true,
      imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
    templateUrl: './services.component.html',
    styleUrl: './services.component.css'
})
export class ServicesComponent {

}
