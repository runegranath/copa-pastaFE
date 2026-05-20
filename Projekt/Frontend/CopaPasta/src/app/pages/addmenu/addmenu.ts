import { Component, inject, signal } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { Menu } from '../../models/menu';
import { MenuResponse } from '../../models/menu-response';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-addmenu',
  imports: [FormsModule],
  templateUrl: './addmenu.html',
  styleUrl: './addmenu.css',
})
export class Addmenu {
  message = signal('');
  menuService = inject(MenuService);

  addMenu(): void {
    const menu: Menu = {
      id: 0, // ID kommer att sättas av backend
      year: 2024,
      week_number: 42,
      is_published: 0, // 0 för ej publicerad, 1 för publicerad
    };

    this.menuService.addMenu(menu).subscribe({
      next: (res: MenuResponse) => this.message.set(res.message),
      error: (err) => {
        this.message.set(err.error?.message ?? 'Ett okänt fel uppstod...')
      }
    });
  }
}
