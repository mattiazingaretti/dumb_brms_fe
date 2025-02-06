import {Component, ViewChild} from '@angular/core';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {provideNativeDateAdapter} from '@angular/material/core';
import { CommonModule } from '@angular/common';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { CtaComponent } from '../../shared/cta/cta.component';
import {  MatDialog} from '@angular/material/dialog';
import { DesignDialogComponent } from '../dialogs/design-dialog/design-dialog.component';
import { RuleDesignWhenComponent } from "../rule-design-when/rule-design-when.component";
import {LocalKeys} from "../../app.routes";
import {RuleDesignThenComponent} from "../rule-design-then/rule-design-then.component";


interface Rule {
  idRule: number;
  ruleName: string;
  conditions: Condition[];
  actions: Action[];
}

interface Condition {
  class?: string;
  field?: string;
  operator?: string;
  value?: any;
}

interface Action {
  class?: string;
  field?: string;
  value?: any;
}


@Component({
  selector: 'app-rule-design',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    CtaComponent,
    RuleDesignWhenComponent,
    RuleDesignThenComponent
  ],
  templateUrl: './rule-design.component.html',
  styleUrl: './rule-design.component.css'
})
export class RuleDesignComponent {
  @ViewChild(MatAccordion) accordion?: MatAccordion;
  rules: Rule[] = [];
  availableClasses: any[] = [];

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.loadAvailableClasses();
    this.loadSavedRules();
  }

  private loadAvailableClasses() {
    const ruleInput = localStorage.getItem(LocalKeys.RULE_INPUT);
    const ruleFormData = localStorage.getItem(LocalKeys.RULE_INPUT_FORM_DATA);

    if (ruleInput && ruleFormData) {
      const inputCards = JSON.parse(ruleInput);
      const formDataArray = JSON.parse(ruleFormData);

      this.availableClasses = inputCards.map((card: any, index: number) => ({
        title: formDataArray[index]?.title || `Class ${index + 1}`,
        fields: card.dataSource.map((field: any) => ({
          identifier: field.dataIdentifier,
          type: field.dataType
        }))
      }));
    }
  }

  private loadSavedRules() {
    const savedRules = localStorage.getItem(LocalKeys.RULES);
    if (savedRules) {
      this.rules = JSON.parse(savedRules);
    }
  }

  addRule() {
    const dialogRef = this.dialog.open(DesignDialogComponent, {
      data: { ruleName: "" },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.isOk && !result?.isCanceled) {
        const newRule: Rule = {
          idRule: this.rules.length + 1,
          ruleName: result.ruleName,
          conditions: [],
          actions: []
        };
        this.rules = [...this.rules, newRule];
        this.saveRules();
      }
    });
  }

  private saveRules() {
    localStorage.setItem(LocalKeys.RULES, JSON.stringify(this.rules));
  }

  onRulesChange() {
    this.saveRules();
  }
}
