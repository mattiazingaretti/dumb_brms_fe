import { CtaComponent } from './../../shared/cta/cta.component';
import { MatInputModule } from '@angular/material/input';
import { Component, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { DynamicFormFieldComponent } from '../../shared/dynamic-form-field/dynamic-form-field.component';
import {AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import {uniqueDataType, validateDataIdentifier} from '../../shared/validators/rule-input.validator';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatGridListModule} from '@angular/material/grid-list';



export interface CardData {
  id: number ,
  readOnly: boolean,
  fGroup: FormGroup,
  dataSource: {dataIdentifier: string, dataType: string}[],
  filteredOptions: string[];
}


@Component({
  selector: 'app-rule-input',
  standalone: true,
  imports: [MatGridListModule,MatAutocompleteModule , CtaComponent,DynamicFormFieldComponent,FormsModule,ReactiveFormsModule, MatFormFieldModule, MatInputModule,MatLabel,MatCardModule,MatError, MatButtonModule, MatTableModule, MatIcon],
  templateUrl: './rule-input.component.html',
  styleUrl: './rule-input.component.css'
})
export class RuleInputComponent {


  options: string[] = ['NUMERIC', 'BOOLEAN', 'STRING', 'NUMERIC[]', 'STRING[]', 'BOOLEAN[]','NUMERIC{}', 'STRING{}', 'BOOLEAN{}'  ];

  cards: CardData[] = [
    {id: 1,readOnly: true, filteredOptions: this.options.slice() , fGroup: this.generateFgroup(), dataSource: [{dataIdentifier: 'ciao', dataType: 'NUMERIC'}] }
  ]

  @ViewChildren('input') input!: QueryList<ElementRef<HTMLInputElement>>;

  displayedColumns: string[] = ['dataType', 'identifier'];


  constructor(){
  }



  getFormControl(card: CardData, arg: string): FormControl {
    return (card.fGroup.get(arg) as FormControl);
  }

  getCardFormGroup(card: CardData): FormGroup {
    return card.fGroup;
  }


  onClickedAdd(card: CardData) {

    const dataType = card.fGroup.get('dataType')?.value
    const dataId = card.fGroup.get('dataIdentifier')?.value

    const found = card.dataSource.find(d => d.dataIdentifier == dataId && d.dataType == dataType)

    if(found === undefined){
      card.dataSource =  [...card.dataSource,{dataIdentifier: dataId, dataType: dataType}]
    }else{
      card.fGroup.setErrors({hasDuplicate: true})
    }

  }


  filter(card: CardData,index : number) {
    const filterValue = this.input.get(index)?.nativeElement.value.toLowerCase();
    if(filterValue != undefined)
      card.filteredOptions = this.options.filter(o => o.toLowerCase().includes(filterValue));
  }

  onClickedSave(card: CardData) {
    card.readOnly = true
  }


  generateFgroup(){
    const fGroup : FormGroup = new FormGroup({
      title: new FormControl<string>('DataType',[Validators.required, validateDataIdentifier, uniqueDataType(this.cards?.map(c => c.fGroup.get('title')?.value)||[])]),
      descr: new FormControl<string>('DataType Descr',[]),
      dataType: new FormControl<string>('', [Validators.required]),
      dataIdentifier: new FormControl<string>('', [Validators.required, validateDataIdentifier])
    });
    return fGroup;
  }

  onClickAddCard() {
    const maxId : number = this.cards.reduce((a,b)=> a.id > b.id  ? a : b)?.id;
    this.cards = [...this.cards, {id: maxId + 1, filteredOptions: this.options.slice(), readOnly: false , fGroup: this.generateFgroup(), dataSource: []}]
  }


  onDeleteCard(card: CardData) {

    this.cards = [...this.cards.filter(c => c.id != card.id)]
  }

}
