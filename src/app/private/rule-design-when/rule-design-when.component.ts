import {
    FormArray,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators, ɵFormGroupRawValue,
    ɵGetProperty, ɵTypedOrUntyped
} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatSelect} from "@angular/material/select";
import {MatSlideToggle} from "@angular/material/slide-toggle";

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
        MatSlideToggle,
    ],
  templateUrl: './rule-design-when.component.html',
  styleUrls: ['./rule-design-when.component.css'],
})
export class RuleDesignWhenComponent {
    @Input() availableClasses: any[] = [];
    @Output() saveConditions = new EventEmitter<any[]>();

    operators = ['equals', 'not equals', 'greater than', 'less than'];
    conditionsForm!: FormGroup;

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.conditionsForm = this.fb.group({
            conditions: this.fb.array([]),
        });

        // Initialize the form with existing conditions if provided
        if (this.availableClasses && this.availableClasses.length > 0) {
            this.patchConditions(this.availableClasses);
        }
    }

    get conditionsArray(): FormArray {
        return this.conditionsForm.get('conditions') as FormArray;
    }

    patchConditions(conditions: any[]) {
        conditions.forEach(condition => this.addCondition(condition));
    }

    addCondition(initialValue: any = null): void {
        const conditionGroup = this.fb.group(
            {
                idCondition: [
                    initialValue?.idCondition || '',
                    [Validators.required, this.uniqueIdConditionValidator()],
                ],
                useIdCondition: [initialValue?.useIdCondition || false],
                class: [initialValue?.class || null],
                field: [initialValue?.field || null, this.matchClassDataTypeValidator()],
                operator: [initialValue?.operator || null],
                value: [initialValue?.value || null],
                referencedIdCondition: [initialValue?.referencedIdCondition || null],
                selectedIdConditionField: [initialValue?.selectedIdConditionField || null],
            },
            { validators: this.matchClassDataTypeValidator() }
        );

        this.conditionsArray.push(conditionGroup);
    }

    removeCondition(index: number): void {
        this.conditionsArray.removeAt(index);
    }

    getClassFields(className: string): any[] {
        if (!className) return [];
        const selectedClass = this.availableClasses.find(c => c.title === className);
        return selectedClass?.fields || [];
    }

    getOtherConditions(i: number): any[] {
        return this.conditionsArray.controls
            .filter((control, index) => index !== i)
            .map(control => control.value.idCondition)
            .filter(idCondition => !!idCondition); // Filter out empty IDs
    }

    getIdConditionFields(referencedIdCondition: string): any[] {
        const condition = this.conditionsArray.controls.find(
            control => control.value.idCondition === referencedIdCondition
        )?.value;

        if (condition && condition.class) {
            return this.getClassFields(condition.class);
        }

        return [];
    }

    uniqueIdConditionValidator(): any {
        return (control: any) => {
            const idCondition = control.value;
            const index = this.conditionsArray.controls.findIndex(
                (formGroup: any) => formGroup.value.idCondition === idCondition
            );

            // Exclude the current condition being validated
            if (index !== -1 && index !== this.conditionsArray.controls.indexOf(control.parent)) {
                return { duplicateIdCondition: true };
            }

            return null;
        };
    }

    matchClassDataTypeValidator(): any {
        return (formGroup: FormGroup) => {
            const fieldControl = formGroup.get('field');
            const selectedIdConditionFieldControl = formGroup.get('selectedIdConditionField');
            const selectedIdConditionControl = formGroup.get('referencedIdCondition');
            const classControl = formGroup.get('class');
            const useIdConditionControl = formGroup.get('useIdCondition');

            if (
                useIdConditionControl?.value &&
                selectedIdConditionFieldControl?.value &&
                fieldControl?.value &&
                classControl?.value && selectedIdConditionControl?.value
            ) {
                const fieldType = this.getFieldDataType(fieldControl.value, classControl?.value);
                const conditionOfSelectedType = ((this.conditionsForm.controls['conditions'] as any).controls as FormGroup[]).find((f: any)=> f.controls['idCondition'].value === selectedIdConditionControl.value)
                const classOfSelectedType = conditionOfSelectedType?.controls['class'].value;
                const selectedFieldType = this.getFieldDataType(selectedIdConditionFieldControl.value, classOfSelectedType);

                if (fieldType !== selectedFieldType) {
                    return { mismatchedClassType: true };
                }
            }

            return null;
        };
    }

    getFieldDataType(fieldIdentifier: string, classValue: string | undefined): string | null {
        return this.availableClasses.find(c => c.title === classValue)?.fields.find((f: any) => f.identifier === fieldIdentifier)?.type;
    }

    getSelectedFieldClass(fieldIdentifier: string): string | null {
        const referencedIdCondition = this.conditionsForm.get('referencedIdCondition')?.value;
        const condition = this.conditionsArray.controls.find(
            control => control.value.idCondition === referencedIdCondition
        )?.value;

        if (condition && condition.class) {
            const field = this.getClassFields(condition.class).find(f => f.identifier === fieldIdentifier);
            return field?.type || null;
        }

        return null;
    }

    save(): void {
        const conditions = this.conditionsArray.value;
        this.saveConditions.emit(conditions); // Emit the conditions array
    }

    isToggleVisible(index: number): boolean {
        const otherConditions = this.getOtherConditions(index);
        return otherConditions.length > 0;
    }
}
