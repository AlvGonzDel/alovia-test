import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDeleteComponent } from './confirm-delete.component';

describe('ConfirmDeleteComponent', () => {
  let component: ConfirmDeleteComponent;
  let fixture: ComponentFixture<ConfirmDeleteComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmDeleteComponent>>;

  const dialogData = {
    id: 1,
    name: 'test',
    heroName: 'testHero',
    location: 'testLocation',
    group: 'testGroup',
    image: 'testImage.jpeg',
    year: 2000,
  };

  beforeEach(() => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      imports: [ConfirmDeleteComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
      ],
    });

    fixture = TestBed.createComponent(ConfirmDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the current hero as passed dialog data', () => {
    expect(component.currentHero).toEqual(dialogData);
  });

  it(' should close the dialog with passed boolean value', () => {
    const confirmed = true;
    component.deleteHero(confirmed);

    expect(dialogRefSpy.close).toHaveBeenCalledWith(confirmed);
  });
});
