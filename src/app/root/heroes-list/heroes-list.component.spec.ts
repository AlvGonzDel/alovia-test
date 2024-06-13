import {
  ComponentFixture,
  TestBed,
  discardPeriodicTasks,
  fakeAsync,
  flush,
  tick,
} from '@angular/core/testing';

import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { HeroesMock } from '../../core/mocks/heroes-mock';
import { HeroesManagementService } from '../../core/services/heroes-management.service';
import { HeroesListComponent } from './heroes-list.component';

describe('HeroesListComponent', () => {
  let component: HeroesListComponent;
  let fixture: ComponentFixture<HeroesListComponent>;
  let heroManagementServiceSpy: jasmine.SpyObj<HeroesManagementService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    heroManagementServiceSpy = jasmine.createSpyObj('HeroesManagementService', {
      heroToEdit$: of(),
      getHeroes: of(HeroesMock),
    });

    await TestBed.configureTestingModule({
      imports: [HeroesListComponent, BrowserAnimationsModule],
      providers: [
        {
          provide: HeroesManagementService,
          useValue: heroManagementServiceSpy,
        },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the heroes', fakeAsync(() => {
    component.getHeroes();
    tick(3000);
    expect(component.allHeroes?.length).not.toBe(0);
    discardPeriodicTasks();
  }));

  it('should show no data template when there are no heroes', () => {
    component.allHeroes = [];
    component.filteredHeroes = [];
    component.isLoading = false;

    fixture.detectChanges();

    const noDataTemplate: DebugElement = fixture.debugElement.query(
      By.css('[data-test="no-data"]')
    );
    expect(noDataTemplate).toBeTruthy();
  });

  it('should show all heroes when there are some', () => {
    component.allHeroes = HeroesMock;

    fixture.detectChanges();

    const heroesTemplates: DebugElement[] = fixture.debugElement.queryAll(
      By.css('[data-test="hero"]')
    );
    expect(heroesTemplates.length).toBe(HeroesMock.length);
  });

  it('should render the spinner when the results are loading', () => {
    component.isLoading = true;

    fixture.detectChanges();

    const spinnerTemplate: DebugElement = fixture.debugElement.query(
      By.css('[data-test="spinner"]')
    );
    expect(spinnerTemplate).toBeTruthy();
  });

  it('should navigate to the form', fakeAsync(() => {
    const navigateButton: DebugElement = fixture.debugElement.query(
      By.css('[data-test="new-hero"]')
    );

    navigateButton.nativeElement.click();
    flush();
    fixture.detectChanges();

    expect(heroManagementServiceSpy.heroToEdit$).toHaveBeenCalledWith();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/form']);
  }));

  it('should call next and complete on destroy$', () => {
    const nextSpy = spyOn(component['destroy$'], 'next');
    const completeSpy = spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
