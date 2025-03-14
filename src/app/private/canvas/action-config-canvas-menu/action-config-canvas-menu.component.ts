import {ChangeDetectionStrategy, ChangeDetectorRef, Component, TemplateRef, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {CdkMenu, CdkMenuItem, CdkMenuTrigger} from "@angular/cdk/menu";
import {ETableColumnKey} from "../../action-config-canvas-domain/table/e-table-column-key";
import {DatabaseApiService} from "../../action-config-canvas-domain";
import {SelectionService} from "../../action-config-canvas-domain/selection.service";
import {ActionConfigCanvasComponent} from "../action-config-canvas/action-config-canvas.component";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-action-config-canvas-menu',
  standalone: true,
  imports: [
    MatIcon,
    CdkMenuItem,
    CdkMenu,
    CdkMenuTrigger
  ],
  templateUrl: './action-config-canvas-menu.component.html',
  exportAs: 'menuComponent',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './action-config-canvas-menu.component.css'
})
export class ActionConfigCanvasMenuComponent {

  private subscriptions: Subscription = new Subscription();

  @ViewChild(TemplateRef, { static: true })
  public template!: TemplateRef<CdkMenu>;

  public column: string | null = null;

  public table: string | null = null;

  public eTableColumnKey = ETableColumnKey;

  constructor(
      private root: ActionConfigCanvasComponent,
      private apiService: DatabaseApiService,
      private selectionService: SelectionService,
      private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  public ngOnInit(): void {
    this.subscriptions.add(this.subscribeToSelectionChanges());
  }

  private subscribeToSelectionChanges(): Subscription {
    return this.selectionService.selection$.subscribe((selection) => {
      this.column = selection.column;
      if (this.root.fFlowComponent.getSelection().fNodeIds.length === 1) {
        this.table = this.root.fFlowComponent.getSelection().fNodeIds[ 0 ];
      } else {
        this.table = null;
        this.column = null;
      }
      this.changeDetectorRef.detectChanges();
    });
  }

  public createTable(menu: CdkMenu): void {
    menu.menuStack.closeAll();
    this.apiService.createTable(this.root.contextMenuPosition);
  }

  public createColumn(menu: CdkMenu): void {
    menu.menuStack.closeAll();
    this.apiService.createColumn(this.table!);
  }

  public delete(table: string | null, column: string | null, menu: CdkMenu): void {
    menu.menuStack.closeAll();
    if (column && table) {
      this.apiService.removeColumn(table, column);
    } else if (table) {
      this.apiService.removeTable(table);
    }
  }

  public setColumnKey(table: string, column: string, key: ETableColumnKey | null, menu: CdkMenu): void {
    menu.menuStack.closeAll();
    this.apiService.changeColumnKey(table, column, key);
  }

  public dispose(): void {
    this.selectionService.reset();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
