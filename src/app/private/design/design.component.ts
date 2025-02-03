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


@Component({
  selector: 'app-design',
  standalone: true,
    imports: [MatTabsModule, MatIconModule, RuleDesignComponent, RuleInputComponent, RuleOutputComponent, FooterComponent],
  templateUrl: './design.component.html',
  styleUrl: './design.component.css'
})
export class DesignComponent {

  idProject?: string
  dataTypes: string[] = [];

  constructor(
      public route : ActivatedRoute,
      public  designControllerService: DesignControllerService
  ){
    this.route.queryParams.subscribe((params: {[key: string]: any})=>{
        this.idProject = params['id'] 
    });

    this.designControllerService.getDataTypes().subscribe((data: RuleDataTypesDTO[]) => {
      this.dataTypes = data.map(d => d.dataType ?? '')
    });
  }



}
