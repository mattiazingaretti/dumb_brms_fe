import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input} from '@angular/core';
import {FFlowModule} from "@foblex/flow";
import {MatIcon} from "@angular/material/icon";
import {ITableColumn} from "../../../action-config-canvas-domain/table/i-table-column";
import {SelectionService} from "../../../action-config-canvas-domain/selection.service";
import {ETableColumnKey} from "../../../action-config-canvas-domain/table/e-table-column-key";

@Component({
  selector: 'app-action-config-canvas-table-column',
  standalone: true,
  templateUrl: './action-config-canvas-table-column.component.html',
  styleUrls: ['./action-config-canvas-table-column.component.scss','./action-config-canvas-table-column.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FFlowModule,
    MatIcon
  ],
  host: {
    'tabindex': '-1',
    '[class.selected]': 'isSelected',
    '(contextmenu)': 'emitSelectionChangeEvent($event)',
  }
})
export class ActionConfigCanvasTableColumnComponent {

  @Input({ required: true })
  public column!: ITableColumn;

  @Input({ required: true })
  public tableId!: string;

  public eTableColumnKey = ETableColumnKey;

  protected isSelected = false;

  private get hostElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  constructor(
      private elementRef: ElementRef,
      private selectionService: SelectionService,
      private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  public select(isSelected: boolean): void {
    this.isSelected = isSelected;
    this.changeDetectorRef.detectChanges();
  }

  protected emitSelectionChangeEvent(event: MouseEvent): void {
    this.hostElement.focus();
    event.preventDefault();
    this.selectionService.setColumn(this.tableId, this.column.id);
  }
}
