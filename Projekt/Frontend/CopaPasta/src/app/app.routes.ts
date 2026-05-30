import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Menus } from './pages/menus/menus';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { Addmenu } from './pages/addmenu/addmenu';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    { path: "", component: Home},
    { path: 'menus', component: Menus },
    { path: 'addmenu', component: Addmenu, canActivate: [authGuard] },
    { path: 'register', component: Register, canActivate: [authGuard] },
    { path: 'login', component: Login },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
