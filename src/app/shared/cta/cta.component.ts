import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-cta',
  standalone: true,
  imports: [CommonModule,MatIconModule,],
  templateUrl: './cta.component.html',
  styleUrl: './cta.component.css'
})
export class CtaComponent {
  
  @Input({required: true}) msg: string = '';
  
  @Input() isOutline: boolean = false;

  @Input() iconName: string | undefined = undefined;


  @Output() clicked: EventEmitter<void> = new EventEmitter();
  
  
}
