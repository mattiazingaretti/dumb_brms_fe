import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ElementRef,
  ViewChild,
  Component,
  Input,
  ViewChildren,
  QueryList,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output, EventEmitter
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-dynamic-form-field',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './dynamic-form-field.component.html',
  styleUrl: './dynamic-form-field.component.css'
})
export class DynamicFormFieldComponent {
  


  isEdit: boolean = false;

  @Input() label: string = '';
  @Input() fControl?: FormControl<any> = new FormControl();
  @Output() changed: EventEmitter<any> = new EventEmitter();

  @ViewChild('myInput') myInput!: ElementRef<HTMLInputElement> ;


  constructor(public cd: ChangeDetectorRef){

  }
  
  onFocusOut() {
    if(this.fControl?.valid)
      this.isEdit = false;
    else 
      this.isEdit = this.isEdit;
  }

  onSubmit() {
    this.onFocusOut(); 
  }
    
  onClick() {
    this.isEdit = true
    this.cd.detectChanges(); //Otherwhise we cannot detect the change in the dom for the ngif
    this.myInput.nativeElement.focus();
  }

  onChange($event: Event) {
    this.changed.emit($event);
  }

}
