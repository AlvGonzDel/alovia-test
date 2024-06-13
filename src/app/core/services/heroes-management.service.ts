import { Injectable, Signal, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';
import { HeroesMock } from '../mocks/heroes-mock';

@Injectable({
  providedIn: 'root',
})
export class HeroesManagementService {
  private _heroes = signal<Hero[]>(HeroesMock);
  public heroes: Signal<Hero[]> = this._heroes.asReadonly();

  private _heroeToEdit = signal<Hero | null>(null);
  public heroToEdit: Signal<Hero | null> = this._heroeToEdit.asReadonly();

  public heroes$(hero: Hero, isDeleting?: boolean): void {
    let heroes: Hero[] = this.heroes();
    const heroIndex: number = heroes.findIndex(
      (currentHero: Hero) => hero.id === currentHero.id
    );

    if (isDeleting) {
      heroes = heroes.filter(
        (currentHero: Hero) => hero.heroName !== currentHero.heroName
      );
    } else if (heroIndex !== -1) {
      heroes[heroIndex] = hero;
    } else {
      heroes = [...heroes, hero];
    }

    this._heroes.set(heroes);
  }

  public getHeroes(): Observable<Hero[]> {
    return of(this.heroes());
  }

  public heroToEdit$(hero?: Hero) {
    if (!hero) {
      this._heroeToEdit.set(null);
      return;
    }

    this._heroeToEdit.set(hero);
  }
}
