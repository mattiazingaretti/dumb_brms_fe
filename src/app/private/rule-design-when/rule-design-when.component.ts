import {FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {AsyncPipe, NgForOf} from "@angular/common";

@Component({
  selector: 'app-rule-design-when',
  standalone: true,
    imports: [
        MatButtonModule,
        MatStepperModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        NgForOf,
        AsyncPipe,
    ],
  templateUrl: './rule-design-when.component.html',
  styleUrls: ['./rule-design-when.component.css'],
})
export class RuleDesignWhenComponent {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  options: string[] = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown'];

  filteredOptions: Observable<string[]> = of([]);

  constructor(private _formBuilder: FormBuilder) {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });

    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });

    this.filteredOptions = this.firstFormGroup.get('firstCtrl')!.valueChanges.pipe(
      startWith(''), 
      map(value => this._filter(value || '')) 
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
