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
    CtaComponent
  ],
  templateUrl: './rule-design.component.html',
  styleUrl: './rule-design.component.css'
})
export class RuleDesignComponent {
  @ViewChild(MatAccordion) accordion?: MatAccordion;

  panels: {idRule: number, ruleName: string}[] = [{idRule: 1, ruleName: "ruleName"}]

  constructor(public dialog: MatDialog){

  }

  addRule(){
    const dialogRef = this.dialog.open(DesignDialogComponent, {data: {ruleName: ""}});


    //TODO add local storage for rule maintance
    dialogRef.afterClosed().subscribe((result) => {
      if(!result.isOk){
        console.error("Something went wrong");
        return
      }
      if(result.isCanceled)
        return
      console.log(result)
      this.panels.push({idRule: 1, ruleName: result.ruleName})
    });
  }
}
