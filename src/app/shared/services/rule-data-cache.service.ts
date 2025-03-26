import {Injectable} from '@angular/core';
import {DesignControllerService} from "../../api/api/designController.service";
import {map, Observable, of, tap} from "rxjs";
import {RuleDataResponseDTO} from "../../api/model/ruleDataResponseDTO";
import {Condition, Rule} from "../../private/rule-design/rule-design.component";
import {RuleDTO} from "../../api/model/ruleDTO";
import {ConditionDTO} from "../../api/model/conditionDTO";
import {WorkflowDTO} from "../../api/model/workflowDTO";

export  const RULE_CACHE_KEY ={
    RULE_DATA: 'ruleData_',
    RULES: `rules_`
};




@Injectable({
  providedIn: 'root'
})
export class RuleDataCacheService {

  constructor( public  designControllerService: DesignControllerService) { }


  getCachedRuleData(idProject: number, force: boolean = false): Observable<RuleDataResponseDTO> {
    const cacheKey = `${RULE_CACHE_KEY.RULE_DATA}${idProject}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData && !force) {
      return of(JSON.parse(cachedData));
    } else {
      return this.designControllerService.getRuleData(idProject).pipe(
          tap(data => {
            localStorage.setItem(cacheKey, JSON.stringify(data));
          })
      );
    }
  }

  getChachedRules(idProject: number, force: boolean = false): Observable<RuleDTO[]> {
      const cacheKey = `${RULE_CACHE_KEY.RULES}${idProject}`;
      const cachedRules = localStorage.getItem(cacheKey);
      if (cachedRules && !force) {
          let rules: RuleDTO[] | null = JSON.parse(cachedRules);
          if (rules === null) {
              return this.getChachedRules(idProject, true);
          }
          return of(rules);
      } else{
          return this.designControllerService.getAllRulesInProject(idProject)
      }
  }



  getCachedRuleConditions(idProject: number, idRule: number, force: boolean = false) : Observable<Rule>{
      const cacheKey = `${RULE_CACHE_KEY.RULES}${idProject}`;
      const cachedRules = localStorage.getItem(cacheKey);
      if (cachedRules && !force) {
          let rules : Rule[] = JSON.parse(cachedRules);
          const matchedRule = rules.find((rule: Rule) => rule.idRule === idRule);
          if(matchedRule === undefined){
              console.error(`Rule with id ${idRule} not found in cache`);
              return this.getCachedRuleConditions(idProject, idRule, true);
          }
          return of(matchedRule);
      } else {
          console.warn("TBD - API call to get rule data");
          return of();
      }

  }
}
