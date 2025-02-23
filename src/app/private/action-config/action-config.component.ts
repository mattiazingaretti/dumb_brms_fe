import {ChangeDetectionStrategy, Component, ViewChild} from '@angular/core';
import {EFConnectionBehavior, EFMarkerType, FFlowModule, FZoomDirective} from "@foblex/flow";
import {FooterComponent} from "../../shared/footer/footer.component";
import {MatButtonModule} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatFormField, MatOption, MatSelect} from "@angular/material/select";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatLabel} from "@angular/material/form-field";
import {ActivatedRoute, Router} from "@angular/router";
import {AppPaths, LocalKeys} from "../../app.routes";
import {DynamicFormFieldComponent} from "../../shared/dynamic-form-field/dynamic-form-field.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Rule} from "../rule-design/rule-design.component";


export interface Workflow {
  name: string;
}

@Component({
  selector: 'app-action-config',
  standalone: true,
  imports: [
    FFlowModule,
    FooterComponent,
    FZoomDirective,
    MatButtonModule,
    MatIcon,
    MatSelect,
    MatOption,
    MatSidenavContent,
    MatSidenavContainer,
    MatFormField,
    MatSidenav,
    MatLabel,
    DynamicFormFieldComponent
  ],
  templateUrl: './action-config.component.html',
  styleUrls: ['./action-config.component.css','./action-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class ActionConfigComponent {

  protected readonly eMarkerType = EFMarkerType;

  @ViewChild(MatSidenav, { static: true })
  sidenav!: MatSidenav;

  @ViewChild(FZoomDirective, { static: true })
  fZoomDirective!: FZoomDirective;


  workflow?: Workflow;
  fGroup!: FormGroup;

  projectId: string | null;
  ruleId: string | null;


  constructor(
      public route : ActivatedRoute,
      public router : Router
  ) {
    this.projectId = this.route.snapshot.queryParamMap.get('projectId');
    this.ruleId = this.route.snapshot.queryParamMap.get('ruleId');

    this.buildForm();
    this.getRuleData();
  }


  zoomIn(): void {
    this.fZoomDirective.zoomIn();
  }
  zoomOut(): void {
    this.fZoomDirective.zoomOut();
  }

  reset(): void {
    this.fZoomDirective.reset();
  }


  onFunctionSelect(functionName: string): void {
    console.log(`Selected function: ${functionName}`);
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }

  save() {

  }

  backToRuleSettings() {
    this.router.navigate([AppPaths.DESIGN_BOARD], { queryParams: { id: this.projectId} });
  }

  private buildForm() {
    this.fGroup = new FormGroup({
      workflowName: new FormControl('[Workflow Name]', [Validators.required]),
    })
  }

  getFormControl() {
    return this.fGroup.controls['workflowName'] as FormControl;
  }


  private getRuleData() {
    if(!this.ruleId) {
      console.error("Undefined rule id");
      return;
    }

    const rules = localStorage.getItem(LocalKeys.RULES);
    if(rules !== null) {
      const ruleData: Rule[] = JSON.parse(rules);
      const rule : Rule | undefined = ruleData.find((rule: any) => rule.id === this.ruleId);

      if(rule) {

      }
    }else{
      //TODO get rules from API passing also the project id

    }

  }
}
