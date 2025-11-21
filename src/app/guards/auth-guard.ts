import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
//
  const auth = inject(Auth);
  const router = inject(Router);
// Verificamos si el usuario está autenticado
  if (!auth.estaAutenticado()) {
    // Si no está autenticado, lo redirigimos al login
    router.navigate(['/login']);
    return false;
  }

  return true;
};

