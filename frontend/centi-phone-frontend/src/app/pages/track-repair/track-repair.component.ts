import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-track-repair',
    standalone: true,
      imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
    templateUrl: './track-repair.component.html',
    styleUrl: './track-repair.component.css'
})
export class TrackRepairComponent {

}
