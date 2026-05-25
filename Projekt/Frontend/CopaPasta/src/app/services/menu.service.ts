import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { Menu } from '../models/menu';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { MenuResponse } from '../models/menu-response';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private http = inject(HttpClient);
  url : string = "http://localhost:3000/api/addmenu";

  getMenus() : Signal<Menu[]> {
    const menus$ = this.http.get<Menu[]>(this.url); // Hämta menyer som Observable $ för att indikera att det är en signal
    return toSignal(menus$, { initialValue: [] });  // Konvertera Observable till Signal, börja med tom array
  }

  addMenu(menu: Menu) : Observable<MenuResponse> {
    const token = localStorage.getItem("token");

    // Skapa en header
    const headers = {
      'authorization' : `Bearer ${token}`
    };

    return this.http.post<MenuResponse>(this.url, menu, { headers });
  }
}
