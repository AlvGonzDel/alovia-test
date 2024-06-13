import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    loadComponent: () =>
      import('./root/heroes-list/heroes-list.component').then(
        (m) => m.HeroesListComponent
      ),
  },
  {
    path: 'form',
    loadComponent: () =>
      import('./root/heroes-form/heroes-form.component').then(
        (m) => m.HeroesFormComponent
      ),
  },
];
