import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import { RuleDesignComponent } from '../rule-design/rule-design.component';
import { RuleInputComponent } from '../rule-input/rule-input.component';
import { RuleOutputComponent } from '../rule-output/rule-output.component';
import {FooterComponent} from "../../shared/footer/footer.component";
import {RuleDataTypesDTO} from "../../api/model/ruleDataTypesDTO";
import {DesignControllerService} from "../../api/api/designController.service";
import {RuleDataResponseDTO} from "../../api/model/ruleDataResponseDTO";
import {Observable} from "rxjs";
import {RuleDataCacheService} from "../../shared/services/rule-data-cache.service";


@Component({
  selector: 'app-design',
  standalone: true,
    imports: [MatTabsModule, MatIconModule, RuleDesignComponent, RuleInputComponent, RuleOutputComponent, FooterComponent],
  templateUrl: './design.component.html',
  styleUrl: './design.component.css'
})
export class DesignComponent {

  idProject!: string
  dataTypes: string[] = [];
  ruleData?: Observable<RuleDataResponseDTO>;

  constructor(
      public route : ActivatedRoute,
      public  designControllerService: DesignControllerService,
      public ruleDataCacheService: RuleDataCacheService
  ){
    this.route.queryParams.subscribe((params: {[key: string]: any})=>{
      this.idProject = params['id']
      if (this.idProject == null) {
        console.error("No project id provided");
        //redirect to error page and kick the user out.
        return;
      }
      this.ruleData = this.ruleDataCacheService.getCachedRuleData(parseInt(this.idProject))
    });


    this.designControllerService.getDataTypes().subscribe((data: RuleDataTypesDTO[]) => {
      this.dataTypes = data.map(d => d.dataType ?? '')
    });
  }



}
