import { Component, Inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-design-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogTitle,
    MatDialogContent,
    MatDialogClose
  ],
  templateUrl: './design-dialog.component.html',
  styleUrl: './design-dialog.component.css'
})
export class DesignDialogComponent {

  ruleNameFormControl = new FormControl('', [Validators.required]);


  constructor(public dialogRef: MatDialogRef<DesignDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {ruleName: string}){

    }
  

    
  onNoClick(): void {
    this.dialogRef.close({isCanceled: true,isOk: true});
  }

  onYesClick(ruleName: string){
    if(this.ruleNameFormControl.invalid)
      return
    this.dialogRef.close({isOk: true, ruleName: ruleName});
  }


}
