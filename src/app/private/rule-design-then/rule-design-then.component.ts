import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'app-rule-design-then',
  standalone: true,
  imports: [
    MatFormField,
    MatSelect,
    MatOption,
    NgForOf,
    FormsModule,
    MatIcon,
    MatIconButton,
    MatInput,
    MatButton,
      MatLabel,
    NgIf
  ],
  templateUrl: './rule-design-then.component.html',
  styleUrl: './rule-design-then.component.css'
})
export class RuleDesignThenComponent {
  @Input() availableClasses: any[] = [];
  @Input() actions: any[] = [];
  @Output() actionsChange = new EventEmitter<any[]>();

  getClassFields(className: string): any[] {
    if (!className) return [];
    const selectedClass = this.availableClasses.find(c => c.title === className);
    return selectedClass?.fields || [];
  }

  addAction() {
    this.actions = [...this.actions, {}];
    this.actionsChange.emit(this.actions);
  }

  removeAction(index: number) {
    this.actions.splice(index, 1);
    this.actionsChange.emit(this.actions);
  }

  trackByFn(index: number) {
    return index;
  }

}
