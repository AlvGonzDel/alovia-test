import { Component } from '@angular/core';
import { Hero } from '../../core/interfaces/hero.interface';

@Component({
  selector: 'app-heroes-list',
  standalone: true,
  imports: [],
  templateUrl: './heroes-list.component.html',
  styleUrl: './heroes-list.component.scss',
})
export class HeroesListComponent {
  public heroesMock: Hero[] = [
    {
      name: 'Peter Parker',
      superpowers: ['strenght', 'aracnic sense'],
      heroName: 'Spiderman',
      location: 'Manhatan',
      image: '',
    },
    {
      name: 'Bruce Wayne',
      superpowers: ['strenght', 'money'],
      heroName: 'Batman',
      location: 'Gotham',
      image: '',
    },
    {
      name: 'Tony Stark',
      superpowers: ['strenght', 'money'],
      heroName: 'Ironman',
      location: 'New York',
      image: '',
    },
    {
      name: 'Rocket',
      superpowers: ['guns', 'raccoon'],
      heroName: 'Rocket',
      location: 'Space',
      image: '',
    },
  ];
}
