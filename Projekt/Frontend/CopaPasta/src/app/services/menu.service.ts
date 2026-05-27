import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { Menu } from '../models/menu';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { MenuResponse } from '../models/menu-response';
import { Dish } from '../models/dish';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private http = inject(HttpClient);
  private getUrl: string = 'http://localhost:3000/api/menus'; // getrutt
  private addUrl: string = 'http://localhost:3000/api/addmenu'; // postrutt

  getMenus(weekNumber: number): Observable<Dish[]> {
     
    return this.http.get<Dish[]>(`${this.getUrl}?week_number=${weekNumber}`); // // Hämta rätter som Observable $ för att indikera att det är en signal och skicka med weekNumber som query-parameter
  }

  addMenu(menu: Menu): Observable<MenuResponse> {
    const token = localStorage.getItem('token');

    // Skapa en header
    const headers = {
      authorization: `Bearer ${token}`,
    };

    return this.http.post<MenuResponse>(this.addUrl, menu, { headers });
  }
}
