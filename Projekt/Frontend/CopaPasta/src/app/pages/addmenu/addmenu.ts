import { Component, inject, signal } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { Menu } from '../../models/menu';
import { MenuResponse } from '../../models/menu-response';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-addmenu',
  imports: [FormsModule, CommonModule],
  templateUrl: './addmenu.html',
  styleUrl: './addmenu.css',
})
export class Addmenu {
  message = signal('');
  menuService = inject(MenuService);

  // Förifyllda värden 
  year: number = 2026; 
  week_number!: number; // Detta får ett värde från användarinput senare
  is_published: number = 0;

  // Mall för veckans dagar så behöriga kan fylla i mat direkt
  dishes = [
    { day_of_week: 'Måndag', title: '', description: '', price: 135 },
    { day_of_week: 'Tisdag', title: '', description: '', price: 135 },
    { day_of_week: 'Onsdag', title: '', description: '', price: 135 },
    { day_of_week: 'Torsdag', title: '', description: '', price: 135 },
    { day_of_week: 'Fredag', title: '', description: '', price: 135 },
  ];

  addMenu(): void {
    if (!this.week_number) {
      this.message.set('Du måste fylla i ett veckonummer!');
      return;
    }

    const newMenu: Menu = {
      year: Number(this.year),
      week_number: Number(this.week_number),
      is_published: Number(this.is_published),
      dishes: this.dishes, //
    };

    this.menuService.addMenu(newMenu).subscribe({
      next: (res: MenuResponse) => {
        this.message.set(res.message);
        this.week_number = this.week_number + 1;
      },
      error: (err) => {
        this.message.set(err.error?.message ?? 'Ett okänt fel uppstod...');
      },
    });
  }
}
