import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import { RuleDesignComponent } from '../rule-design/rule-design.component';
import { RuleInputComponent } from '../rule-input/rule-input.component';
import { RuleOutputComponent } from '../rule-output/rule-output.component';


@Component({
  selector: 'app-design',
  standalone: true,
  imports: [MatTabsModule, MatIconModule, RuleDesignComponent, RuleInputComponent, RuleOutputComponent],
  templateUrl: './design.component.html',
  styleUrl: './design.component.css'
})
export class DesignComponent {

  idProject?: string

  constructor(public route : ActivatedRoute){
    this.route.queryParams.subscribe((params: {[key: string]: any})=>{
        this.idProject = params['id'] 
    });
  }



}
