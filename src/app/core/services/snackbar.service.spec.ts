import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarTypes } from '../enums/snackbar-type.enum';
import { SnackbarData } from '../interfaces/snackbar-data.interface';
import { SnackbarService } from './snackbar.service';

describe('SnackbarService', () => {
  let service: SnackbarService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [SnackbarService, { provide: MatSnackBar, useValue: spy }],
    });

    service = TestBed.inject(SnackbarService);
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open snackbar with correct attributes when call openSnackbar', () => {
    const snackbarData: SnackbarData = {
      text: 'message',
      type: SnackbarTypes.Success,
    };

    service.openSnackbar(snackbarData);

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      snackbarData.text,
      undefined,
      {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        panelClass: [snackbarData.type],
      }
    );
  });
});
