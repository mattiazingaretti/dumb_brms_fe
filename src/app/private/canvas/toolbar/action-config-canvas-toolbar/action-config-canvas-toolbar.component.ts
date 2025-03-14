import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {ActionConfigCanvasComponent} from "../../action-config-canvas/action-config-canvas.component";

@Component({
  selector: 'app-action-config-canvas-toolbar',
  standalone: true,
  imports: [
    MatIcon
  ],
  templateUrl: './action-config-canvas-toolbar.component.html',
  styleUrls: ['./action-config-canvas-toolbar.component.scss','./action-config-canvas-toolbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionConfigCanvasToolbarComponent {

  constructor(
      private flowComponent: ActionConfigCanvasComponent
  ) {
  }

  public onZoomIn(): void {
    this.flowComponent.fZoomDirective.zoomIn();
  }

  public onZoomOut(): void {
    this.flowComponent.fZoomDirective.zoomOut();
  }

  public onFitToScreen(): void {
    this.flowComponent.fCanvasComponent.fitToScreen();
  }

  public onOneToOne(): void {
    this.flowComponent.fCanvasComponent.resetScaleAndCenter();
  }
}
