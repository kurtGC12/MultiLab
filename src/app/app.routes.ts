import { Routes } from '@angular/router';


// Guards
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';
// Components
import { Home } from './components/home/home';
import { Login } from './components/auth/login/login';
import { Registro } from './components/auth/registro/registro';

export const routes: Routes = [

     {
    path: '',
    component: Home
  },
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full'
  },


  // Rutas de comodin (404)
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }


];
