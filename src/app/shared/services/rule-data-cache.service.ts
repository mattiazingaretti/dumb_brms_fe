import { Injectable } from '@angular/core';
import {DesignControllerService} from "../../api/api/designController.service";
import {catchError, Observable, of, tap} from "rxjs";
import {RuleDataResponseDTO} from "../../api/model/ruleDataResponseDTO";

@Injectable({
  providedIn: 'root'
})
export class RuleDataCacheService {

  constructor( public  designControllerService: DesignControllerService) { }
  
  
  getCachedRuleData(idProject: number, force: boolean = false): Observable<RuleDataResponseDTO> {
    const cacheKey = `ruleData_${idProject}`;
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
