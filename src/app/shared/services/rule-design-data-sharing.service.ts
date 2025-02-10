import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RuleDesignDataSharingService {

  refreshData: BehaviorSubject<boolean> = new BehaviorSubject(false);


  constructor() { }

  setDataRefresh(className: boolean) {
      this.refreshData.next(className);
  }

  isRefreshDataNeeded() {
      return this.refreshData.asObservable();
  }

  completeRefreshData() {
    this.refreshData.complete();
  }

}
