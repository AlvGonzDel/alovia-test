import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./root/heroes-list/heroes-list.component').then(
        (m) => m.HeroesListComponent
      ),
  },
];
