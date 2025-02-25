import {Injectable} from '@angular/core';
import {DesignControllerService} from "../../api/api/designController.service";
import {Observable, of, tap} from "rxjs";
import {RuleDataResponseDTO} from "../../api/model/ruleDataResponseDTO";

export  const RULE_CACHE_KEY ={
    RULE_DATA: 'ruleData_'
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
}
