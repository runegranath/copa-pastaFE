import { Component, computed, inject, signal } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-menus',
  imports: [],
  templateUrl: './menus.html',
  styleUrl: './menus.css',
})
export class Menus {
  menuService = inject(MenuService);

  selectedWeek = signal<number>(this.getCurrentWeekNumber());

  // Varje gång selectedWeek ändras skapas en ny Observable som hämtar menyerna för den veckan
  private menusObservable$ = computed(() => {
    return this.menuService.getMenus(this.selectedWeek());
  });

  menus = toSignal(
    this.menusObservable$(), 
    { initialValue: [] }
  );

  nextWeek() {
    this.selectedWeek.update(w => w + 1);
  }

  prevWeek() {
    this.selectedWeek.update(w => w - 1);
  }

  // Funktion för att räkna ut det aktuella veckonumret enligt ISO-8601
  private getCurrentWeekNumber(): number {
    const today = new Date();
    const target = new Date(today.valueOf());
    const dayNr = (today.getDay() + 6) % 7; // gör så att måndag blir 0 och söndag 6

    target.setDate(target.getDate() - dayNr + 3); // sätter datumet till torsdagen i samma vecka
    const firstThursday = target.valueOf();
    
    target.setMonth(0, 1); // gå till 1:a januari
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7)); // hitta första torsdagen i januari
    }
    
    // Räkna ut antalet veckor mellan de två torsdagarna
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  }
}
