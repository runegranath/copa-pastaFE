import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { OrderResponse } from '../../models/order-response';
import { AdminOrder } from '../../models/admin-order';

@Component({
  selector: 'app-orders',
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {
  private menuService = inject(MenuService);

  // Signalen som håller orderlistan
  adminOrders = signal<AdminOrder[]>([]);

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.menuService.getAllOrders().subscribe({
      next: (data: AdminOrder[]) => { // det är en array av AdminOrder som landar i next
        this.adminOrders.set(data);
      },
      error: (err) => console.error(err),
    });
  }

  updateStatus(orderId: number, newStatus: 'pending' | 'ready') {
    this.menuService.updateOrderStatus(orderId, newStatus).subscribe({
      next: (res: OrderResponse) => {
        console.log(res.message);

        // adminOrders-signalen uppdateras genom att mappa över orderlistan och ändra det som tillkommit, dvs orderstatus
        this.adminOrders.update((orders) =>
          orders.map((order) =>
            order.id === orderId ? { ...order, order_status: newStatus } : order,
          ),
        );
      },
      error: (err) => console.error(err),
    });
  }

  deleteOrder(orderId: number) {
    this.menuService.deleteOrder(orderId).subscribe({
      next: (res: OrderResponse) => {
        console.log(res.message);

        // filter gör en ny lista med alla orders utom den som raderats och uppdaterar signalen
        this.adminOrders.update((orders) => orders.filter((order) => order.id !== orderId));
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
