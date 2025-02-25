import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {Router} from "@angular/router";
import {AppPaths} from "../../app.routes";
import {Rule} from "../rule-design/rule-design.component";

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
  @Input() idProject!: string;
  @Input() rule!: Rule;


  constructor(private router: Router) {
  }

  goToNewActionConfig() {
    this.router.navigate([AppPaths.ACTION_CONFIG], {
      queryParams: {ruleId: this.rule.idRule,projectId:this.idProject }
    })
  }


}
