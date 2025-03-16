import {Injectable} from '@angular/core';
import {DesignControllerService} from "../../api/api/designController.service";
import {Observable, of, tap} from "rxjs";
import {RuleDataResponseDTO} from "../../api/model/ruleDataResponseDTO";
import {Rule} from "../../private/rule-design/rule-design.component";

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
