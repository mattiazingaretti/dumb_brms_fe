import {FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatSelect} from "@angular/material/select";

@Component({
  selector: 'app-rule-design-when',
  standalone: true,
    imports: [
        MatButtonModule,
        MatStepperModule,
        MatLabel,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        NgForOf,
        AsyncPipe,
        MatIcon,
        MatSelect,
        NgIf,
    ],
  templateUrl: './rule-design-when.component.html',
  styleUrls: ['./rule-design-when.component.css'],
})
export class RuleDesignWhenComponent {
    @Input() availableClasses: any[] = [];
    @Input() conditions: any[] = [];
    @Output() conditionsChange = new EventEmitter<any[]>();

    operators = ['equals', 'not equals', 'greater than', 'less than'];

    addCondition() {
        this.conditions = [...this.conditions, {}];
        this.conditionsChange.emit(this.conditions);
    }

    removeCondition(index: number) {
        this.conditions.splice(index, 1);
        this.conditionsChange.emit(this.conditions);
    }

    trackByField(index: number, field: any): string {
        return field.identifier;
    }

    trackByFn(index: number) {
        return index;
    }
    getClassFields(className: string): any[] {
        if (!className) return [];
        const selectedClass = this.availableClasses.find(c => c.title === className);
        return selectedClass?.fields || [];
    }
}
