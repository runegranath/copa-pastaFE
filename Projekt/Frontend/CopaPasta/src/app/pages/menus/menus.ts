import { ChangeDetectorRef, Component, computed, inject, signal } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { map, switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { Dish } from '../../models/dish';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menus',
  imports: [CommonModule, FormsModule],
  templateUrl: './menus.html',
  styleUrl: './menus.css',
})
export class Menus {
  menuService = inject(MenuService);
  private cdr = inject(ChangeDetectorRef);
  private snackBar = inject(MatSnackBar);
  authService = inject(AuthService);

  // Referens för inloggningsstatus som används i html
  isAdmin = this.authService.isLoggedIn;

  // håller på vilken rätt som är i redigeringsläge, null om ingen är det.
  editingDishId = signal<number | null>(null);

  // håller koll på veckonummer som användare väljer och startar på aktuell vecka
  selectedWeek = signal<number>(this.getCurrentWeekNumber());
  selectedYear = signal<number>(new Date().getFullYear());

  // Sorteringsordning för frontend
  private dayOrder: { [key: string]: number } = {
    Måndag: 1,
    Tisdag: 2,
    Onsdag: 3,
    Torsdag: 4,
    Fredag: 5,
    'Veckans vegetariska': 6,
  };

  private weekYear$ = toObservable(
    computed(() => ({
      week: this.selectedWeek(),
      year: this.selectedYear(),
    })),
  );

  // konvertera den senaste Observable till en signal som komponenten kan använda som innehåller rätter för vald vecka
  menus = toSignal(
    this.weekYear$.pipe(
      switchMap(({ week, year }) => this.menuService.getMenus(week, year)),

      // mappning eller sorteringen som sköts i frontend av rätter
      map((dishes: Dish[]) => {
        return [...dishes].sort((a, b) => {
          // Hämta ordningsnummer från dayOrder, eller ge 99 om dagen inte finns i listan
          const orderA = this.dayOrder[a.day_of_week] || 99;
          const orderB = this.dayOrder[b.day_of_week] || 99;

          return orderA - orderB; // Sorterar stigande
        });
      }),
    ),
    { initialValue: [] },
  );

  // Håller koll på vilken rätt som rä vald i gränssnittet, null om ingen är vald
  activeDishId: number | null = null;

  // formulärdataobjekt
  orderData = {
    customer_name: '',
    customer_phone: '',
    pickup_time: '',
    quantity: 1,
  };

  // metod för att ändra rätter i redigeringsläge
  startEdit(dishId: number) {
    this.editingDishId.set(dishId);
  }

  saveDishChanges(dish: Dish) {
    console.log('Sparar ändringar:', dish);

    this.menuService.updateDish(dish).subscribe({
      next: () => {
        // Sätter null för att stänga redigeringsläget
        this.editingDishId.set(null);

        this.snackBar.open('Maträtten har uppdaterats.', 'Stäng', {
          duration: 3000,
        });
      },
      error: (err) => {
        console.error(err);

        this.snackBar.open('Kunde inte uppdatera maträtten.', 'Stäng', {
          duration: 3000,
        });
      },
    });
  }

  // Metod för att öppna/stänga beställningsformuläret för en specifik rätt
  toggleOrderForm(dishId: number) {
    if (this.activeDishId === dishId) {
      this.activeDishId = null; // Stäng om man klickar på samma igen
    } else {
      this.activeDishId = dishId; // Öppna för denna maträtt
      this.resetOrderForm(); // Nollställ fälten så gamla uppgifter försvinner
    }
  }

  // Metod för att skicka beställningen till backend
  submitOrder(dish: Dish) {
    // Slå ihop dishId med resten av formulärdatan till ett orderobjekt
    const completeOrder = {
      dish_id: dish.id,
      ...this.orderData,
    };

    // Skicka beställningen till backend
    this.menuService.createOrder(completeOrder).subscribe({
      next: (res) => {
        console.log(res);

        // Stäng formuläret och nollställ det
        this.activeDishId = null;

        // märker att det skett förändringar så snackbaren kan visas
        this.cdr.detectChanges();

        this.snackBar.open(
          `Tack! Din förbeställning är mottagen till klockan ${this.orderData.pickup_time} 🍴`,
          'Stäng',
          {
            duration: 5000,
            verticalPosition: 'top',
          },
        );
        this.resetOrderForm();
      },

      error: (err) => {
        console.error(err);
        this.snackBar.open('Något gick fel. Kunde inte skicka beställningen. ❌', 'Stäng', {
          duration: 5000,
          verticalPosition: 'top',
        });
      },
    });
  }

  // Rensa formuläret
  resetOrderForm() {
    this.orderData = {
      customer_name: '',
      customer_phone: '',
      pickup_time: '',
      quantity: 1,
    };
  }

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

  // metod för att bekräfta borttagning av en rätt
  confirmDelete(dishTitle: string): void {
    const week = this.selectedWeek();
    const year = this.selectedYear();

    const confirmDelete = confirm(
      `Är du säker på att du vill ta bort "${dishTitle}"? Hela veckan kommer att raderas!`,
    );

    if (confirmDelete) {
      this.deleteWeek(year, week);
    }
  }

  deleteWeek(year: number, week: number): void {
    this.menuService.deleteEntireWeek(year, week).subscribe({
      next: () => {
        // Switchmap aktiveras och uppdaterar selectedWeek-signalen vilket triggar en ny hämtning av menyn
        this.selectedWeek.set(this.selectedWeek());

        this.snackBar.open(`Vecka ${week} har tagits bort.`, 'Stäng', { duration: 3000 });
        setTimeout(() => {
          window.location.reload(); // Laddar om sidan efter 3,5sek för att säkerställa att alla komponenter uppdateras korrekt
        }, 500);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Kunde inte ta bort veckan. ❌', 'Stäng', { duration: 3000 });
      },
    });
  }
}
