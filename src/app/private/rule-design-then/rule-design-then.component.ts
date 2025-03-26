import {Component, Input} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {MatButton} from "@angular/material/button";
import {Router} from "@angular/router";
import {AppPaths} from "../../app.routes";
import {Rule} from "../rule-design/rule-design.component";
import {RuleDTO} from "../../api/model/ruleDTO";

@Component({
  selector: 'app-rule-design-then',
  standalone: true,
  imports: [
    FormsModule,
    MatIcon,
    MatButton
  ],
  templateUrl: './rule-design-then.component.html',
  styleUrl: './rule-design-then.component.css'
})
export class RuleDesignThenComponent {
  @Input() idProject!: string;
  @Input() rule!: RuleDTO;


  constructor(private router: Router) {
  }

  goToNewActionConfig() {
    this.router.navigate([AppPaths.ACTION_CONFIG], {
      queryParams: {ruleId: this.rule.idRule,projectId:this.idProject }
    })
  }


}
