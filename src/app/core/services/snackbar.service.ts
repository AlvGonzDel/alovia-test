import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarData } from '../interfaces/snackbar-data.interface';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackbar: MatSnackBar) {}

  public openSnackbar(data: SnackbarData) {
    this.snackbar.open(data.text, undefined, {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: [data.type],
    });
  }
}
