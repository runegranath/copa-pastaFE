import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-orders',
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {
  private menuService = inject(MenuService);

  // Signalen som håller orderlistan
  adminOrders = signal<any[]>([]);

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.menuService.getAllOrders().subscribe({
      next: (data) => {
        this.adminOrders.set(data);
      },
      error: (err) => console.error(err),
    });
  }

  updateStatus(orderId: number, newStatus: string) {
    console.log(`Uppdatera order ${orderId} till ${newStatus}`);
  }

  deleteOrder(orderId: number) {
    console.log(`Ta bort order ${orderId}`);
  }
}
