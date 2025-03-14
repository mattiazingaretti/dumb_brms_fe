import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MatTooltip} from "@angular/material/tooltip";
import {DatabaseApiService, ETableRelationType, ITableConnectionViewModel} from "../../../action-config-canvas-domain";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'div[app-action-config-canvas-connection-toolbar]',
  standalone: true,
    imports: [
        MatTooltip,
        MatIcon
    ],
  templateUrl: './app-action-config-canvas-connection-toolbar.component.html',
  styleUrls: ['./app-action-config-canvas-connection-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppActionConfigCanvasConnectionToolbarComponent {


  @Input({ required: true })
  public viewModel!: ITableConnectionViewModel;

  public eTableRelationType = ETableRelationType;

  constructor(
      private apiService: DatabaseApiService,
  ) {
  }

  public changeConnectionType(type: ETableRelationType): void {
    this.apiService.changeConnectionType(this.viewModel.id, type);
  }

  public removeConnection(): void {
    this.apiService.removeConnection(this.viewModel.id);
  }
}
