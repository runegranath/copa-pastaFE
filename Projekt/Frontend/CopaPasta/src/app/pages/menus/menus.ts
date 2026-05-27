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

  selectedWeek = signal<number>(25);

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
}
