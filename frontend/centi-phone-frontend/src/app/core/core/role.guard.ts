import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from '../core/services/auth/user.service'; // Ajuster le chemin selon l'emplacement
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Disponible dans toute l'application
})
export class RoleGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const requiredRole = route.data['role']; // Le rôle requis pour la route

    const userRole = this.userService.getUserRole(); // Méthode pour récupérer le rôle de l'utilisateur (exemple)

    if (userRole === requiredRole) {
      return true; // L'utilisateur a le rôle requis
    } else {
      this.router.navigate(['/unauthorized']); // Redirection si rôle insuffisant
      return false;
    }
  }
}
