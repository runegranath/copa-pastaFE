import { Component } from '@angular/core';

@Component({
  selector: 'app-menus',
  imports: [],
  templateUrl: './menus.html',
  styleUrl: './menus.css',
})
export class Menus {
  menuService = inject(MenuService);

  menus = this.menuService.getMenus();
}
