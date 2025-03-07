import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from 'src/app/core/core/services/auth/user.service';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  csrfToken: string | null = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService
    
  ) {}

  ngOnInit(): void {  
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
