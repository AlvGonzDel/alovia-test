import { Injectable, Signal, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';
import { HeroesMock } from '../mocks/heroes-mock';

@Injectable({
  providedIn: 'root',
})
export class HeroesManagementService {
  public heroes: Hero[] = HeroesMock;

  private _heroeToEdit = signal<Hero | null>(null);
  public heroToEdit: Signal<Hero | null> = this._heroeToEdit.asReadonly();

  public heroes$(hero: Hero, isDeleting?: boolean): void {
    let currentHeroes: Hero[] = this.heroes;

    const heroIndex: number = currentHeroes.findIndex(
      (currentHero: Hero) => hero.id === currentHero.id
    );

    if (isDeleting) {
      currentHeroes = currentHeroes.filter(
        (currentHero: Hero) => hero.heroName !== currentHero.heroName
      );
    } else if (heroIndex !== -1) {
      currentHeroes[heroIndex] = hero;
    } else {
      currentHeroes = [...currentHeroes, hero];
    }

    this.heroes = currentHeroes;
  }

  public getHeroes(): Observable<Hero[]> {
    return of(this.heroes);
  }

  public heroToEdit$(hero?: Hero) {
    if (!hero) {
      this._heroeToEdit.set(null);
      return;
    }

    this._heroeToEdit.set(hero);
  }
}
