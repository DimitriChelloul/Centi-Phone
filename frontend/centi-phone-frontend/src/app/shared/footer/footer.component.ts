import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-footer',
    standalone: true,
    
    imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css'],
    
})
export class FooterComponent {}

