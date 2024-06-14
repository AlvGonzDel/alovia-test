import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, Signal, effect } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';
import { SnackbarTypes } from '../../core/enums/snackbar-type.enum';
import { Hero } from '../../core/interfaces/hero.interface';
import { SnackbarData } from '../../core/interfaces/snackbar-data.interface';
import { HeroesManagementService } from '../../core/services/heroes-management.service';
import { SnackbarService } from '../../core/services/snackbar.service';

@Component({
  selector: 'app-heroes-form',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatCardModule,
    MatTooltipModule,
    TitleCasePipe,
    CommonModule,
  ],
  templateUrl: './heroes-form.component.html',
  styleUrl: './heroes-form.component.scss',
  providers: [TitleCasePipe],
})
export class HeroesFormComponent implements OnInit, OnDestroy {
  public heroToEdit: Signal<Hero | null> =
    this.heroesManagementService.heroToEdit;

  public heroForm: FormGroup = this.fb.group({
    name: [this.heroToEdit()?.name ?? '', Validators.required],
    heroName: [
      this.titlecasePipe.transform(this.heroToEdit()?.heroName) ?? '',
      Validators.required,
    ],
    year: [this.heroToEdit()?.year ?? '', Validators.required],
    location: [this.heroToEdit()?.location ?? '', Validators.required],
    group: [this.heroToEdit()?.group ?? '', Validators.required],
    image: [this.heroToEdit()?.image ?? '', Validators.required],
  });

  public allHeroes: Hero[];
  public isEditing: boolean;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private heroesManagementService: HeroesManagementService,
    private snackbarService: SnackbarService,
    private titlecasePipe: TitleCasePipe
  ) {
    effect(() => {
      this.isEditing = !!this.heroToEdit();
    });
  }

  public ngOnInit(): void {
    this.subForm();
    this.getHeroes();
  }

  public submitHero(): void {
    const alreadyAdded: boolean = this.allHeroes.some(
      (hero: Hero) =>
        hero.heroName.toLowerCase() === this.heroForm.get('heroName')?.value
    );
    if (alreadyAdded && !this.isEditing) {
      const snackbarText: string = `${this.titlecasePipe.transform(
        this.heroForm.get('heroName')?.value
      )} is already in the list, if you need changes, edit it.`;

      this.openSnackbar(snackbarText, SnackbarTypes.Error);
      return;
    }

    this.addHeroToList();
  }

  public goBack(): void {
    this.router.navigate(['list']);
  }

  public ngOnDestroy(): void {
    this.heroesManagementService.heroToEdit$();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getHeroes(): void {
    this.heroesManagementService
      .getHeroes()
      .pipe(take(1))
      .subscribe({
        next: (heroes: Hero[]) => {
          if (!heroes.length) return;

          this.allHeroes = heroes;
        },
      });
  }

  private subForm(): void {
    this.heroForm
      .get('heroName')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((heroName: string) => {
        this.heroForm
          .get('heroName')
          ?.setValue(this.titlecasePipe.transform(heroName), {
            emitEvent: false,
          });
      });
  }

  private addHeroToList(): void {
    const newHero: Hero = {
      ...this.heroForm.value,
      id: this.isEditing ? this.heroToEdit()?.id : Math.random() * 1000,
    };

    this.heroesManagementService.heroes$(newHero);

    const snackbarText: string = `${this.titlecasePipe.transform(
      this.heroForm.get('heroName')?.value
    )} was successfully ${this.isEditing ? 'edited' : 'created'}`;

    this.openSnackbar(snackbarText, SnackbarTypes.Success);
    this.goBack();
  }

  private openSnackbar(text: string, type: SnackbarTypes) {
    const snackbarData: SnackbarData = {
      text,
      type,
    };

    this.snackbarService.openSnackbar(snackbarData);
  }
}
