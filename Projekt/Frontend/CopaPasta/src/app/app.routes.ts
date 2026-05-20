import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Menus } from './pages/menus/menus';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { Addmenu } from './pages/addmenu/addmenu';

export const routes: Routes = [
    { path: "", component: Home},
    { path: 'menus', component: Menus },
    { path: 'addmenu', component: Addmenu },
    { path: 'register', component: Register },
    { path: 'login', component: Login },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
