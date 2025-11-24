
import { Routes } from '@angular/router';


// Home
import { Home} from './components/home/home';
import { Login } from './components/auth/login/login';
import { Registro} from './components/auth/registro/registro';
import { Recuperar } from './components/auth/recuperar/recuperar';
// Laboratorios
import { LaboratorioList } from './components/laboratorio-list/laboratorio-list';
import { LaboratorioForm} from './components/laboratorio-form/laboratorio-form';
import { LaboratorioDetalle } from './components/laboratorio-detalle/laboratorio-detalle';

// Perfil
import { Perfil } from './components/perfil/perfil';
import { UsuarioList} from './components/usuario-list/usuario-list';

// Guards
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

// ======================================================================
// Rutas del sistema
// ======================================================================
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

  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'recuperar', component: Recuperar },

  // ============================================================
  // PERFIL DEL USUARIO (solo ANALISTA logueado)
  // ============================================================
  {
    path: 'perfil',
    component: Perfil,
    canActivate: [authGuard]      // requiere sesión activa
  },

  // ============================================================
  // RUTAS DE GESTIÓN DE USUARIOS Y LABORATORIOS
  // ============================================================ 
  {
    path: 'usuarios',
    component: UsuarioList,
    canActivate: [adminGuard]     // requiere ser ADMIN
  },

  {
    path: 'laboratorios',
    component: LaboratorioList,
    canActivate: [authGuard]      // ambos roles pueden ver libros
  },

  {
    path: 'laboratorios/nuevo',
    component: LaboratorioForm,
    canActivate: [adminGuard]     // solo ADMIN puede crear
  },

  {
    path: 'laboratorios/:id/editar',
    component: LaboratorioForm,
    canActivate: [adminGuard]     // solo ADMIN puede editar
  },

  {
    path: 'laboratorios/:id',
    component: LaboratorioDetalle,
    canActivate: [authGuard]      // ambos roles pueden ver detalle
  },

  // ============================================================
  // RUTA comodín (404)
  // ============================================================
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

