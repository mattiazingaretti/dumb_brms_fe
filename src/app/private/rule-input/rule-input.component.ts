import { CtaComponent } from './../../shared/cta/cta.component';
import { MatInputModule } from '@angular/material/input';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { DynamicFormFieldComponent } from '../../shared/dynamic-form-field/dynamic-form-field.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { validateDataIdentifier, validateTitle} from '../../shared/validators/rule-input.validator';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatGridListModule} from '@angular/material/grid-list';

@Component({
  selector: 'app-rule-input',
  standalone: true,
  imports: [MatGridListModule,MatAutocompleteModule , CtaComponent,DynamicFormFieldComponent,FormsModule,ReactiveFormsModule, MatFormFieldModule, MatInputModule,MatLabel,MatCardModule,MatError, MatButtonModule, MatTableModule, MatIcon],
  templateUrl: './rule-input.component.html',
  styleUrl: './rule-input.component.css'
})
export class RuleInputComponent {
onClickAddCard() {
throw new Error('Method not implemented.');
}

  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  
  dataSource: {dataIdentifier: string, dataType: string}[] = [];
  displayedColumns: string[] = ['dataType', 'identifier'];
  

  options: string[] = ['NUMERIC', 'BOOLEAN', 'STRING', 'NUMERIC[]', 'STRING[]', 'BOOLEAN[]','NUMERIC{}', 'STRING{}', 'BOOLEAN{}'  ];
  filteredOptions: string[];
  readOnly: boolean = false;

  constructor(){
    this.filteredOptions = this.options.slice();
  }

  fGroup : FormGroup = new FormGroup({
    title: new FormControl<string>('Input Data Type Name',[Validators.required, validateTitle('Input Data Type Name'), validateDataIdentifier]),
    descr: new FormControl<string>('Input Data Type Descr',[]),
    dataType: new FormControl<string>('', [Validators.required]),
    dataIdentifier: new FormControl<string>('', [Validators.required, validateDataIdentifier])
  });


  getFormControl(arg: string): FormControl {
    return (this.fGroup.get(arg) as FormControl);
  }

  

  onClickedAdd() {
    const dataType = this.getFormControl('dataType').value
    const dataId = this.getFormControl('dataIdentifier').value

    const found = this.dataSource.find(d => d.dataIdentifier == dataId && d.dataType == dataType)

    if(found === undefined){
      this.dataSource =  [...this.dataSource,{dataIdentifier: dataId, dataType: dataType}]
    }else{
      this.fGroup.setErrors({hasDuplicate: true})
    }

  }


  filter() {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredOptions = this.options.filter(o => o.toLowerCase().includes(filterValue));
  }
    

  onClickedSave() {
    this.readOnly = true
  }
    
}
