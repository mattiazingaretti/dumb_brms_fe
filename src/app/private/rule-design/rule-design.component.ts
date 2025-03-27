import {Component, Input, ViewChild} from '@angular/core';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {provideNativeDateAdapter} from '@angular/material/core';
import {CommonModule} from '@angular/common';
import {MatSlideToggleChange, MatSlideToggleModule} from '@angular/material/slide-toggle';
import {CtaComponent} from '../../shared/cta/cta.component';
import {MatDialog} from '@angular/material/dialog';
import {DesignDialogComponent} from '../dialogs/design-dialog/design-dialog.component';
import {RuleDesignWhenComponent} from "../rule-design-when/rule-design-when.component";
import {LocalKeys} from "../../app.routes";
import {RuleDesignThenComponent} from "../rule-design-then/rule-design-then.component";
import {RuleDesignDataSharingService} from "../../shared/services/rule-design-data-sharing.service";
import {RuleDataResponseDTO} from "../../api/model/ruleDataResponseDTO";
import {Observable, take} from "rxjs";
import {DynamicFormFieldComponent} from "../../shared/dynamic-form-field/dynamic-form-field.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {WarningDialogComponent} from "../../shared/dialogs/warning-dialog/warning-dialog.component";
import {Workflow} from "../action-config/action-config.component";
import {RuleDataCacheService} from "../../shared/services/rule-data-cache.service";
import {DesignControllerService} from "../../api/api/designController.service";
import {RuleDTO} from "../../api/model/ruleDTO";
import {WorkflowDTO} from "../../api/model/workflowDTO";
import {ConditionDTO} from "../../api/model/conditionDTO";


export interface Rule {
  idRule?: number;
  ruleName: string;
  salience: number;
  conditions: Condition[];
  workflow?: Workflow;
}

export interface Condition {
  class?: string;
  field?: string;
  operator?: string;
  idCondition?: number;
  conditionNameId: string;
  value?: any;
  useIdCondition?: boolean;
}

export interface Action {
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
    RuleDesignThenComponent,
    DynamicFormFieldComponent
  ],
  templateUrl: './rule-design.component.html',
  styleUrl: './rule-design.component.css'
})
export class RuleDesignComponent {
  @Input() ruleData?: Observable<RuleDataResponseDTO>;
  @Input() idProject!: string ;

  @ViewChild(MatAccordion) accordion?: MatAccordion;
  rules: RuleDTO[] = [];
  availableClasses: any[] = [];
  formGroup: FormGroup = new FormGroup({});

  constructor(
      public dialog: MatDialog,
      public ruleDesignDataSharingService: RuleDesignDataSharingService,
      public designControllerService: DesignControllerService,
      public ruleCacheService: RuleDataCacheService
  ) {}


  ngOnInit() {
    this.loadAvailableClasses();
    this.formGroup = new FormGroup({});
    this.loadSavedRules();
    this.ruleDesignDataSharingService.isRefreshDataNeeded().subscribe((flg)=>{
      if(flg){
        this.loadAvailableClasses()
      }
    })
  }

  private loadAvailableClasses() {
    const ruleInput = localStorage.getItem(LocalKeys.RULE_INPUT);
    const ruleFormData = localStorage.getItem(LocalKeys.RULE_INPUT_FORM_DATA);
    
    if(!ruleInput || !ruleFormData){
      console.warn("Rule input or form data is missing from local storage")
    }
    let inputCards: any = []
    let formDataArray : any

    if (ruleInput && ruleFormData) {
      inputCards = JSON.parse(ruleInput);
      formDataArray = JSON.parse(ruleFormData);
      this.availableClasses = inputCards.map((card: any, index: number) => ({
        title: formDataArray[index]?.title || `Class ${index + 1}`,
        fields: card.dataSource.map((field: any) => ({
          identifier: field.dataIdentifier,
          type: field.dataType
        }))
      }));
    }else{
     this.ruleData?.pipe(take(1)).subscribe((data: RuleDataResponseDTO)=>{
       this.availableClasses = [...data.inputData!, ...data.outputData!].map((card: any, index: number) => ({
         title: card.className || `Class ${index + 1}`,
         fields: card.fields.map((field: any) => ({
           identifier: field.fieldName,
           type: field.fieldType
         }))
       }));
     });
    }
  }

  private loadSavedRules() {

    this.ruleCacheService.getChachedRules(parseInt(this.idProject)).subscribe((rules: RuleDTO[]) => {

      this.rules = rules;
      localStorage.setItem(`${LocalKeys.RULES}_${this.idProject}`, JSON.stringify(this.rules));

      this.rules.forEach((r, index)=>{
        this.formGroup.addControl(index!.toString(), new FormControl<number|null>(r.salience||100, [Validators.required, Validators.pattern(/^[0-9]*$/)]));
      })
      this.ruleDesignDataSharingService.setConditionsChanged(true);
    });
  }




  addRule() {
    const dialogRef = this.dialog.open(DesignDialogComponent, {
      data: { ruleName: "" },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.isOk && !result?.isCanceled) {
        const newRule: RuleDTO = {
          ruleName: result.ruleName,
          conditions: [],
          salience: 100,
          flgActive: false
        };
        this.rules = [...this.rules, newRule];
        this.saveRules(newRule);
      }
    });
  }


  private saveRules(newRule: RuleDTO) {

    this.designControllerService.addRuleInProj(newRule, parseInt(this.idProject)).subscribe((data)=>{
      const rule = this.rules.find((r) => r.ruleName === newRule.ruleName && (r.idRule === null || r.idRule === undefined));
      if (rule) {
        rule.idRule = data.idRule;
      }
      this.rules = [...this.rules];
      localStorage.setItem(`${LocalKeys.RULES}_${this.idProject}`, JSON.stringify(this.rules));

    });
  }

  onRulesChange(conditions: ConditionDTO[], rule: RuleDTO) {
    const changedRuleIdx = this.rules.findIndex((r)=> r.idRule === rule.idRule)
    if(changedRuleIdx === -1){
      console.error("Faield to find rule for which we need to save conditons  ");
      return;
    }
    this.rules.at(changedRuleIdx)!.conditions = conditions
    this.rules = [...this.rules];
    // this.saveRules();
    this.updateRules();
  }

  ngOnDestroy() {
    this.ruleDesignDataSharingService.completeRefreshData()
  }

  getFormControl(idRule: number) {
    return this.formGroup.get(idRule.toString()) as FormControl;
  }

  onSalienceChange(rule: RuleDTO,i: number ) {
    const control = this.getFormControl(i!);
    if (!control || control.invalid ) {
      console.error("Invalid control on salience change");
      return;
    }
    rule.salience = parseInt(control.value);
    this.rules = [...this.rules];
    this.updateRules()
  }

  deleteRule(rule: RuleDTO) {
    const dialogRef = this.dialog.open(WarningDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete Rule "${rule.ruleName}"?`,
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {

        // this.saveRules();

        this.designControllerService.deleteRuleInProj([rule], parseInt(this.idProject)).subscribe((data)=>{
            console.warn("Rule deleted successfully", data);
            const filteredRules = this.rules.filter((r) => r.idRule !== rule.idRule);
            this.rules = [...filteredRules]
            localStorage.setItem(`${LocalKeys.RULES}_${this.idProject}`, JSON.stringify(this.rules));
        });
      }else {
        console.warn("Deletion cancelled");
      }
    });

  }

  toggleRuleActivation(rule: RuleDTO, $event: MatSlideToggleChange) {
    // console.warn("Toggle rule activation", idRule, $event.checked);
    rule.flgActive = $event.checked;
    this.designControllerService.activateRuleInProj(rule, parseInt(this.idProject)).subscribe(()=>{
        console.warn("Rule activation updated successfully");
    });
  }


  private updateRules() {
      this.designControllerService.patchRulesInProject(this.rules, parseInt(this.idProject)).subscribe((data)=>{
        this.rules = data
        localStorage.setItem(`${LocalKeys.RULES}_${this.idProject}`, JSON.stringify(data));
        this.ruleDesignDataSharingService.setConditionsChanged(true);
      });
  }
}
