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
    this.menuService.updateOrderStatus(orderId, newStatus).subscribe({
      next: (res) => {
        console.log(res.message);
        
        // adminOrders-signalen uppdateras genom att mappa över orderlistan och ändra det som tillkommit, dvs orderstatus
        this.adminOrders.update(orders => 
          orders.map(order => 
            order.id === orderId ? { ...order, order_status: newStatus } : order
          )
        );
      },
      error: (err) => {
        console.error('Kunde inte uppdatera statusen:', err);
      }
    });
  }

  deleteOrder(orderId: number) {
    // Bekräfta innan radering 
    if (confirm(`Är du säker på att du vill ta bort order #${orderId}?`)) {
      this.menuService.deleteOrder(orderId).subscribe({
        next: (res) => {
          console.log(res.message);
          
         // filter gör en ny lista med alla orders utom den som raderats och uppdaterar signalen
          this.adminOrders.update(orders => 
            orders.filter(order => order.id !== orderId)
          );
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }
}
