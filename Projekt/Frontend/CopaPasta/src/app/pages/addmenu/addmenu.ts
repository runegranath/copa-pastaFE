import { Component, inject, signal } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { Menu } from '../../models/menu';
import { MenuResponse } from '../../models/menu-response';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-addmenu',
  imports: [FormsModule, CommonModule],
  templateUrl: './addmenu.html',
  styleUrl: './addmenu.css',
})
export class Addmenu {
  message = signal('');
  menuService = inject(MenuService);
  snackBar = inject(MatSnackBar);

  // Förifyllda värden
  year: number = 2026;
  week_number!: number; // Detta får ett värde från användarinput senare

  // Mall för veckans dagar så behöriga kan fylla i mat direkt
  dishes = [
    { day_of_week: 'Måndag', title: '', description: '', price: 135 },
    { day_of_week: 'Tisdag', title: '', description: '', price: 135 },
    { day_of_week: 'Onsdag', title: '', description: '', price: 135 },
    { day_of_week: 'Torsdag', title: '', description: '', price: 135 },
    { day_of_week: 'Fredag', title: '', description: '', price: 135 },
  ];

  standingVeg = {
    day_of_week: 'Veckans vegetariska',
    title: '',
    description: '',
    price: 115,
  };

  addMenu(): void {
    // rensa gamla meddelanden
    this.message.set('');

    // ett veckonummer måste finnas inom ramarna av 1-53
    if (!this.week_number || this.week_number < 1 || this.week_number > 53) {
      this.message.set('Ange ett giltigt veckonummer (1-53)!');
      return;
    }

    // ett år måste finnas inom rimliga gränser
    if (!this.year || this.year < 2020 || this.year > 2100) {
      this.message.set('Ange ett giltigt år!');
      return;
    }

    // filtrera bort dagar där ingen maträtt har fyllts i för t.ex. röda dagar
    const filledDishes = this.dishes.filter((dish) => dish.title.trim() !== '');

    // Kolla om den stående vegetariska rätten fyllts i och inkludera isf
    if (this.standingVeg.title.trim() !== '') {
      filledDishes.push(this.standingVeg);
    }

    if (filledDishes.length === 0) {
      this.message.set('Du måste fylla i minst en maträtt för veckan!');
      return;
    }

    // filtrera bort rätter med negativa priser
    const hasNegativePrice = filledDishes.some(dish => dish.price <= 0);
    if (hasNegativePrice) {
      this.message.set('Alla ifyllda rätter måste ha ett giltigt pris över 0 kr.');
      return;
    }

    const newMenu: Menu = {
      year: Number(this.year),
      week_number: Number(this.week_number),
      dishes: filledDishes,
    };

    this.menuService.addMenu(newMenu).subscribe({
      next: (res: MenuResponse) => {
        this.snackBar.open(res.message || 'Menyn har sparats!', 'Stäng', {
          duration: 4000, 
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });

        // Återställ och städa formuläret
        this.standingVeg.title = '';       
        this.standingVeg.description = ''; 
        this.dishes.forEach(dish => {
          dish.title = '';
          dish.description = '';
        });
        this.week_number = this.week_number + 1;
      },
      error: (err) => {
        this.message.set(err.error?.message ?? 'Ett okänt fel uppstod...');
      },
    });
  }
}
