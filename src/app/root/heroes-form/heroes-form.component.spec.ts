import { TitleCasePipe } from '@angular/common';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { HeroesMock } from '../../core/mocks/heroes-mock';
import { HeroesManagementService } from '../../core/services/heroes-management.service';
import { HeroesFormComponent } from './heroes-form.component';

describe('HeroesFormComponent', () => {
  let component: HeroesFormComponent;
  let fixture: ComponentFixture<HeroesFormComponent>;
  let heroesManagementServiceSpy: jasmine.SpyObj<HeroesManagementService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let titleCasePipe: TitleCasePipe;

  beforeEach(async () => {
    heroesManagementServiceSpy = jasmine.createSpyObj(
      'HeroesManagementService',
      {
        heroes$: of(),
        heroToEdit$: of(),
        heroToEdit: signal({}),
        getHeroes: of(HeroesMock),
      }
    );

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [
        HeroesFormComponent,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
      providers: [
        FormBuilder,
        {
          provide: HeroesManagementService,
          useValue: heroesManagementServiceSpy,
        },
        { provide: Router, useValue: routerSpy },
        TitleCasePipe,
      ],
    });

    fixture = TestBed.createComponent(HeroesFormComponent);
    component = fixture.componentInstance;

    titleCasePipe = TestBed.inject(TitleCasePipe);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to form changes and transform hero name to title case in the ngOnInit', () => {
    const mockHeroName = 'mock heroname';
    const titleCaseHeroName = titleCasePipe.transform(mockHeroName);
    heroesManagementServiceSpy.getHeroes.and.returnValue(of([]));
    let heroNameControl = component.heroForm.get('heroName');
    spyOn(heroNameControl?.valueChanges, 'pipe' as never).and.callThrough();
    spyOn(heroNameControl, 'setValue' as never);

    component.ngOnInit();

    heroNameControl?.setValue(titleCaseHeroName, { emitEvent: false });

    expect(heroNameControl?.valueChanges.pipe).toHaveBeenCalled();
    expect(heroNameControl?.setValue).toHaveBeenCalledWith(titleCaseHeroName, {
      emitEvent: false,
    });
  });

  it('should not add hero if it is already in the list', () => {
    const heroNameControl = component.heroForm.get('heroName');
    heroNameControl?.setValue('testHero');
    component.allHeroes = HeroesMock;
    const spy = spyOn(component, 'openSnackbar' as never);

    component.submitHero();

    expect(spy).toHaveBeenCalled();
  });

  it('should add a new hero if it is not in the list', () => {
    const heroName = 'newTestHero';
    component.allHeroes = HeroesMock;
    component.heroForm.setValue({
      name: 'newTestHero',
      heroName: heroName,
      year: '2000',
      location: 'location',
      group: 'group',
      image: 'image',
    });

    component.submitHero();

    expect(heroesManagementServiceSpy.heroes$).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['list']);
  });

  it('should navigate to list', () => {
    component.goBack();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['list']);
  });

  it('should call next and complete on destroy$', () => {
    const nextSpy = spyOn(component['destroy$'], 'next');
    const completeSpy = spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(heroesManagementServiceSpy.heroToEdit$).toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
