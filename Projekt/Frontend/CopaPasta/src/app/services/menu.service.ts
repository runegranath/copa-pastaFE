import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, Signal } from '@angular/core';
import { Menu } from '../models/menu';
import { Observable } from 'rxjs';
import { MenuResponse } from '../models/menu-response';
import { Dish } from '../models/dish';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private http = inject(HttpClient);
  private getUrl: string = 'https://bbw-be.onrender.com/api/menus'; // getrutt för meny
  private addUrl: string = 'https://bbw-be.onrender.com/api/addmenu'; // postrutt för meny
  private orderUrl = 'https://bbw-be.onrender.com/api/orders'; // orders-rutten
  private deleteUrl = 'https://bbw-be.onrender.com/api/dishes'; // deleterutt för rätter på menyn

  getMenus(weekNumber: number, year: number): Observable<Dish[]> {
    return this.http.get<Dish[]>(`${this.getUrl}?week_number=${weekNumber}&year=${year}`); // Hämtar veckans meny som en Observable och skickar med veckonummer som query-parameter
  }

  addMenu(menu: Menu): Observable<MenuResponse> {
    const token = localStorage.getItem('token');

    // Skapa en header
    const headers = {
      authorization: `Bearer ${token}`,
    };

    return this.http.post<MenuResponse>(this.addUrl, menu, { headers });
  }

  createOrder(orderData: any): Observable<any> {
    return this.http.post(this.orderUrl, orderData);
  }

  getAllOrders(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = {
      authorization: `Bearer ${token}`,
    };
    return this.http.get<any[]>('https://bbw-be.onrender.com/api/orders', { headers });
  }

  updateOrderStatus(id: number, status: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { authorization: `Bearer ${token}` };

    // ready skickas som status när en order klickas klar i adminsidan
    return this.http.put(`${this.orderUrl}/${id}`, { order_status: status }, { headers });
  }

  deleteOrder(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { authorization: `Bearer ${token}` };
    return this.http.delete(`${this.orderUrl}/${id}`, { headers });
  }

  deleteEntireWeek(year: number, week: number): Observable<void> {
    const token = localStorage.getItem('token');

    const headers = {
      authorization: `Bearer ${token}`,
    };

    return this.http.delete<void>(`${this.deleteUrl}/week/${year}/${week}`, { headers });
  }
}
