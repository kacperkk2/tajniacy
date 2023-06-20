import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { MatListOption } from '@angular/material/list';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirm-dialog.html'
})
export class ConfirmDialog {
  constructor(
      public dialogRef: MatDialogRef<ConfirmDialog>, 
      @Inject(MAT_DIALOG_DATA) public text: string
      ) {}
}