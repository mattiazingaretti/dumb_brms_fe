import {Component, Input} from '@angular/core';
import {ITableViewModel} from "../../../action-config-canvas-domain/table/i-table-view-model";
import {DatabaseApiService} from "../../../action-config-canvas-domain";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-action-config-canvas-table-header',
  standalone: true,
  imports: [
    MatIcon
  ],
  templateUrl: './action-config-canvas-table-header.component.html',
  styleUrls: ['./action-config-canvas-table-header.component.scss','./action-config-canvas-table-header.component.css']
})
export class ActionConfigCanvasTableHeaderComponent {

  @Input({ required: true })
  public viewModel!: ITableViewModel;

  constructor(
      private apiService: DatabaseApiService,
  ) {
  }

  public removeTable(): void {
    this.apiService.removeTable(this.viewModel.id);
  }

  public createColumn(): void {
    this.apiService.createColumn(this.viewModel.id);
  }
}
