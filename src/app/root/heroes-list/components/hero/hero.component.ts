import { TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { SnackbarTypes } from '../../../../core/enums/snackbar-type.enum';
import { Hero } from '../../../../core/interfaces/hero.interface';
import { SnackbarData } from '../../../../core/interfaces/snackbar-data.interface';
import { HeroesManagementService } from '../../../../core/services/heroes-management.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [MatCardModule, TitleCasePipe, MatTooltipModule],
  providers: [TitleCasePipe],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  @Input()
  public hero: Hero;
  @Output()
  public readonly getHeroes = new EventEmitter<void>();

  constructor(
    private dialog: MatDialog,
    private snackBarService: SnackbarService,
    private titleCasePipe: TitleCasePipe,
    private heroesManagementService: HeroesManagementService,
    private router: Router
  ) {}

  public deleteHero() {
    const dialog = this.dialog.open(ConfirmDeleteComponent, {
      maxWidth: '600px',
      data: this.hero,
    });

    dialog
      .afterClosed()
      .pipe(take(1))
      .subscribe((confirm: boolean) => {
        if (!confirm) return;

        this.showSnackbar();
        this.heroesManagementService.heroes$(this.hero, true);
        this.getHeroes.emit();
      });
  }

  public editHero() {
    this.heroesManagementService.heroToEdit$(this.hero);
    this.router.navigate(['/form']);
  }

  private showSnackbar(): void {
    const snackbarData: SnackbarData = {
      text: `${this.titleCasePipe.transform(
        this.hero.heroName
      )} deleted from list`,
      type: SnackbarTypes.Error,
    };

    this.snackBarService.openSnackbar(snackbarData);
  }
}
