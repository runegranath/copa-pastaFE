import { Component, computed, inject, signal } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-menus',
  imports: [CommonModule],
  templateUrl: './menus.html',
  styleUrl: './menus.css',
})
export class Menus {
  menuService = inject(MenuService);

  // håller koll på veckonummer som användare väljer och startar på aktuell vecka
  selectedWeek = signal<number>(this.getCurrentWeekNumber());
  selectedYear = signal<number>(new Date().getFullYear());

  private weekYear$ = toObservable(
    computed(() => ({
      week: this.selectedWeek(),
      year: this.selectedYear(),
    })),
  );

  // konvertera den senaste Observable till en signal som komponenten kan använda som innehåller rätter för vald vecka
  menus = toSignal(
    this.weekYear$.pipe(switchMap(({ week, year }) => this.menuService.getMenus(week, year))),
    { initialValue: [] },
  );

  // Slå om till vecka 1 om räknaren går över 53 och öka året
  nextWeek() {
    this.selectedWeek.update((w) => {
      const currentWeek = Number(w);

  
      if (currentWeek >= 53) {
        this.selectedYear.update((y) => y + 1);
        return 1; // börja om på v1
      }

      return currentWeek + 1;
    });
  }

  prevWeek() {
    this.selectedWeek.update((w) => {
      const currentWeek = Number(w);

     
      if (currentWeek <= 1) {
        this.selectedYear.update((y) => y - 1);
        return 52; 
      }

      return currentWeek - 1;
    });
  }

  // metod för att räkna ut det aktuella veckonumret enligt ISO-8601
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
