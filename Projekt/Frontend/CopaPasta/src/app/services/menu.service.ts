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
  private getUrl: string = 'http://localhost:3000/api/menus'; // getrutt för meny
  private addUrl: string = 'http://localhost:3000/api/addmenu'; // postrutt för meny
  private orderUrl = 'http://localhost:3000/api/orders'; // orders-rutten

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
    return this.http.get<any[]>('http://localhost:3000/api/orders', { headers });
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
}
