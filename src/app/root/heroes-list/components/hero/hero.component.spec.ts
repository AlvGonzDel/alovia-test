import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugElement } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { HeroesMock } from '../../../../core/mocks/heroes-mock';
import { HeroesManagementService } from '../../../../core/services/heroes-management.service';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component';
import { HeroComponent } from './hero.component';

describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmDeleteComponent>>;
  let heroManagementServiceSpy: jasmine.SpyObj<HeroesManagementService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of(true));

    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpy.open.and.returnValue(dialogRefSpy);

    heroManagementServiceSpy = jasmine.createSpyObj('HeroesManagementService', {
      heroes$: of(),
      heroToEdit$: of(),
    });
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HeroComponent, BrowserAnimationsModule],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        {
          provide: HeroesManagementService,
          useValue: heroManagementServiceSpy,
        },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all hero properties', () => {
    component.hero = HeroesMock[0];

    fixture.detectChanges();

    const nameInput: DebugElement = fixture.debugElement.query(
      By.css('[data-test="name"]')
    );
    const heroNameInput: DebugElement = fixture.debugElement.query(
      By.css('[data-test="heroName"]')
    );

    const groupInput: DebugElement = fixture.debugElement.query(
      By.css('[data-test="group"]')
    );

    const locationInput: DebugElement = fixture.debugElement.query(
      By.css('[data-test="location"]')
    );

    const yearInput: DebugElement = fixture.debugElement.query(
      By.css('[data-test="location"]')
    );
    expect(
      nameInput && heroNameInput && groupInput && locationInput && yearInput
    ).toBeTruthy();
  });

  it('should delete a hero when user confirms', () => {
    component.hero = HeroesMock[0];

    fixture.detectChanges();

    let getHeroesSpy = spyOn(component.getHeroes, 'emit');

    component.deleteHero();

    expect(dialogSpy.open).toHaveBeenCalledWith(ConfirmDeleteComponent, {
      maxWidth: '600px',
      data: component.hero,
    });

    expect(heroManagementServiceSpy.heroes$).toHaveBeenCalledWith(
      component.hero,
      true
    );
    expect(getHeroesSpy).toHaveBeenCalled();
  });

  it('should edit a hero', () => {
    component.editHero();

    expect(heroManagementServiceSpy.heroToEdit$).toHaveBeenCalledWith(
      component.hero
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/form']);
  });
});
