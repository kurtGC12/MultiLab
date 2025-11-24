import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.esAdmin()) {
    // Si no es admin, lo devolvemos al Home
    router.navigate(['/home']);
    return false;
  }

  return true;
};

