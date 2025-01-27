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


export interface Actions{

}

export interface Conditions{

}

export interface Rule{
  idRule: number,
  ruleName: string ,
  conditions: Conditions[]
  actions: Actions[]
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
    RuleDesignWhenComponent
],
  templateUrl: './rule-design.component.html',
  styleUrl: './rule-design.component.css'
})
export class RuleDesignComponent {
  @ViewChild(MatAccordion) accordion?: MatAccordion;

  rules: Rule[] = [{idRule: 1, ruleName: "TestRuleName", conditions: [], actions: []}]

  constructor(public dialog: MatDialog){

  }

  addRule(){
    const dialogRef = this.dialog.open(DesignDialogComponent, {data: {ruleName: ""}});

    dialogRef.afterClosed().subscribe((result) => {
      if(!result.isOk){
        console.error("Something went wrong");
        return
      }
      if(result.isCanceled)
        return
      this.rules.push({idRule: this.rules.length+1, ruleName: result.ruleName , conditions: [] , actions: []})
    });
  }
}
