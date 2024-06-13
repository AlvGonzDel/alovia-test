import { TestBed } from '@angular/core/testing';
import { Hero } from '../interfaces/hero.interface';
import { HeroesMock } from '../mocks/heroes-mock';
import { HeroesManagementService } from './heroes-management.service';

describe('HeroesManagementService', () => {
  let service: HeroesManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroesManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return heroes', (done: DoneFn) => {
    service.getHeroes().subscribe((value) => {
      expect(value).toBe(service.heroes);
      done();
    });
  });

  it(' should set and get hero to edit', () => {
    const hero = HeroesMock[0];

    service.heroToEdit$(hero);

    expect(service.heroToEdit()).toEqual(hero);

    service.heroToEdit$();

    expect(service.heroToEdit()).toBeNull();
  });

  it('should add, edit, or delete heroes', () => {
    const newHero: Hero = HeroesMock[0];

    service.heroes$(newHero);
    expect(service.heroes.includes(newHero)).toBeTrue();

    newHero.name = 'updateTest';
    service.heroes$(newHero);
    expect(
      service.heroes.find((hero: Hero) => hero.id === newHero.id)?.name
    ).toEqual(HeroesMock[0].name);

    service.heroes$(newHero, true);
    expect(service.heroes.includes(newHero)).toBeFalse();
  });
});
