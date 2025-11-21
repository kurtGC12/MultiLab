import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const adminGuard: CanActivateFn = (route, state) => {

  const auth = inject(Auth);
  const router = inject(Router);

  if (!auth.esAdmin()) {
    // Si no es admin, lo devolvemos al Home
    router.navigate(['/home']);
    return false;
  }

  return true;
};

