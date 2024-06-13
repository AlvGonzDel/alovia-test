import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Subject, delay, take, takeUntil } from 'rxjs';
import {
  FullScreenConfig,
  IFullScreenConfig,
} from '../../core/congifs/spinner.config';
import { SnackbarTypes } from '../../core/enums/snackbar-type.enum';
import { Hero } from '../../core/interfaces/hero.interface';
import { SnackbarData } from '../../core/interfaces/snackbar-data.interface';
import { HeroesManagementService } from '../../core/services/heroes-management.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { HeroComponent } from './components/hero/hero.component';

@Component({
  selector: 'app-heroes-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    HeroComponent,
    MatTooltipModule,
    NgxSpinnerModule,
    CommonModule,
  ],
  templateUrl: './heroes-list.component.html',
  styleUrl: './heroes-list.component.scss',
})
export class HeroesListComponent implements OnInit, OnDestroy {
  public heroesFilterForm: FormGroup = this.fb.group({
    filterText: this.fb.control(''),
  });

  public get filterText(): FormControl {
    return this.heroesFilterForm.get('filterText') as FormControl;
  }

  private destroy$ = new Subject<void>();

  public filteredHeroes: Hero[] = [];
  public allHeroes: Hero[] = [];
  public fullScreenConfig: IFullScreenConfig = FullScreenConfig;
  public isLoading: boolean;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private heroesManagementService: HeroesManagementService,
    private snackbarService: SnackbarService,
    private spinner: NgxSpinnerService
  ) {}

  public ngOnInit(): void {
    this.subForm();
    this.getHeroes();
  }

  public navigateToCreation(): void {
    this.heroesManagementService.heroToEdit$();
    this.router.navigate(['/form']);
  }

  public getHeroes(): void {
    this.spinner.show();
    this.isLoading = true;

    this.heroesManagementService
      .getHeroes()
      .pipe(take(1), delay(500))
      .subscribe({
        next: (heroes: Hero[]) => {
          if (!heroes?.length) return;

          this.allHeroes = heroes;
          this.isLoading = false;
          this.spinner.hide();
        },
        error: () => {
          const snackbarData: SnackbarData = {
            text: 'There was an error trying to get the heroes',
            type: SnackbarTypes.Error,
          };

          this.snackbarService.openSnackbar(snackbarData);
          this.isLoading = false;
          this.spinner.hide();
        },
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subForm(): void {
    this.filterText.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((text: string) => {
        this.filteredHeroes = this.allHeroes.filter((hero: Hero) =>
          this.filterHeroes(hero, text)
        );
      });
  }

  private filterHeroes(hero: Hero, text: string): boolean {
    return Object.values(hero).some((property: string | number) =>
      property.toString().toLowerCase().includes(text.toLowerCase())
    );
  }
}
