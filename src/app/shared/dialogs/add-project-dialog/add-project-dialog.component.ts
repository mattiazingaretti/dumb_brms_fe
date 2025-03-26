import {Component, inject, model, ModelSignal} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef, MatDialogTitle
} from "@angular/material/dialog";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";

export interface Project {
  name: string
}

@Component({
  selector: 'app-add-project-dialog',
  standalone: true,
  imports: [
    MatDialogContent,
    MatFormField,
    MatInput,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatDialogTitle,
    MatLabel,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-project-dialog.component.html',
  styleUrl: './add-project-dialog.component.css'
})
export class AddProjectDialogComponent {


  readonly dialogRef = inject(MatDialogRef<AddProjectDialogComponent>);
  readonly data = inject<Project>(MAT_DIALOG_DATA);
  projectForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.projectForm = this.fb.group({
      projectName: ['', Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close({isOk: true, projName: undefined});
  }

  onYesClick(): void {
    if (this.projectForm.valid) {
      this.dialogRef.close({isOk: true, projName: this.projectForm.get('projectName',)?.value});
    }
  }

}
