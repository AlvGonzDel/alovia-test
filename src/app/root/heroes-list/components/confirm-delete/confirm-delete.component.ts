import { TitleCasePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Hero } from '../../../../core/interfaces/hero.interface';

@Component({
  selector: 'app-confirm-delete',
  standalone: true,
  imports: [TitleCasePipe, MatTooltipModule],
  templateUrl: './confirm-delete.component.html',
  styleUrl: './confirm-delete.component.scss',
})
export class ConfirmDeleteComponent {
  public currentHero: Hero;

  constructor(
    private dialogRef: MatDialogRef<ConfirmDeleteComponent>,
    @Inject(MAT_DIALOG_DATA)
    private hero: Hero
  ) {
    this.currentHero = this.hero;
  }

  public deleteHero(isConfirmed: boolean) {
    this.dialogRef.close(isConfirmed);
  }
}
