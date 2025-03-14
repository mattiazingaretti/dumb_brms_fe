import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewChild} from '@angular/core';
import {Block} from "../../action-config/action-config.component";
import {
  EFMarkerType, EFResizeHandleType,
  FCanvasChangeEvent,
  FCanvasComponent,
  FCreateConnectionEvent,
  FFlowComponent,
  FFlowModule, FMinimapComponent, FMinimapFlowDirective,
  FReassignConnectionEvent,
  FSelectionChangeEvent,
  FZoomDirective
} from "@foblex/flow";
import {startWith, Subscription} from "rxjs";
import {FormArray, FormGroup} from "@angular/forms";
import {IPoint, Point, PointExtensions} from "@foblex/2d";
import {
  BuildFormHandler,
  BuildFormRequest,
  DatabaseApiService,
  EReloadReason,
  IDatabaseModel
} from "../../action-config-canvas-domain";
import {SelectionService} from "../../action-config-canvas-domain/selection.service";
import { BrowserService } from '@foblex/platform';
import {ITableViewModel} from "../../action-config-canvas-domain";
import {ETableRelationType} from "../../action-config-canvas-domain";
import {CdkContextMenuTrigger} from "@angular/cdk/menu";
import {
  ActionConfigCanvasTableComponent
} from "../table/action-config-canvas-table/action-config-canvas-table.component";
import {
  ActionConfigCanvasToolbarComponent
} from "../toolbar/action-config-canvas-toolbar/action-config-canvas-toolbar.component";
import {ActionConfigCanvasMenuComponent} from "../action-config-canvas-menu/action-config-canvas-menu.component";
import {
  AppActionConfigCanvasConnectionToolbarComponent
} from "../toolbar/app-action-config-canvas-connection-toolbar/app-action-config-canvas-connection-toolbar.component";

@Component({
  selector: 'app-action-config-canvas',
  standalone: true,
  imports: [
    FFlowModule,
    CdkContextMenuTrigger,
    FZoomDirective,
    ActionConfigCanvasTableComponent,
    ActionConfigCanvasToolbarComponent,
    ActionConfigCanvasMenuComponent,
    AppActionConfigCanvasConnectionToolbarComponent
  ],
  templateUrl: './action-config-canvas.component.html',
  styleUrls: [
    '../styles/_variables.scss',
    '../styles/_cdk-panel.scss',
    '../styles/_icon-button.scss',
    '../styles/_mdc-form-field.scss',
    './action-config-canvas.component.scss',
    './action-config-canvas.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.single-selection]': 'isSingleSelection'
  }
})
export class ActionConfigCanvasComponent {
  @Input() blocks!: Block[];



  private subscriptions$: Subscription = new Subscription();

  protected viewModel: IDatabaseModel = {
    tables: [],
    groups: [],
    connections: []
  };

  @ViewChild(FFlowComponent, { static: true })
  public fFlowComponent!: FFlowComponent;

  @ViewChild(FCanvasComponent, { static: true })
  public fCanvasComponent!: FCanvasComponent;

  @ViewChild(FZoomDirective, { static: true })
  public fZoomDirective!: FZoomDirective;

  protected readonly eMarkerType = EFMarkerType;

  public isSingleSelection: boolean = true;

  protected form: FormGroup = new FormGroup({
    tables: new FormArray([])
  });

  public contextMenuPosition: IPoint = PointExtensions.initialize(0, 0);

  public eResizeHandleType = EFResizeHandleType;

  constructor(
      private apiService: DatabaseApiService,
      private selectionService: SelectionService,
      private changeDetectorRef: ChangeDetectorRef,
      private fBrowser: BrowserService
  ) {
  }



  public ngOnInit(): void {
    this.subscriptions$.add(this.subscribeOnReloadData());
  }

  private subscribeOnReloadData(): Subscription {
    return this.apiService.reload$.pipe(startWith(null)).subscribe((reason: EReloadReason | null) => {
      this.getData();
      if (reason === EReloadReason.CONNECTION_CHANGED) {
        this.fFlowComponent.clearSelection();
      }
    });
  }

  public onInitialized(): void {
    this.fCanvasComponent.fitToScreen(new Point(140, 140), false);
  }

  private getData(): void {
    this.viewModel = this.apiService.get();
    this.form = new BuildFormHandler().handle(new BuildFormRequest(this.viewModel));
    this.changeDetectorRef.markForCheck();
  }

  public getTableForm(id: string): FormGroup {
    return (this.form.get('tables') as FormGroup).get(id) as FormGroup;
  }

  public canvasChanged(event: FCanvasChangeEvent): void {
    this.fBrowser.document.documentElement.style.setProperty('--flow-scale', `${ event.scale }`);
  }

  public selectionChanged(event: FSelectionChangeEvent): void {
    this.isSingleSelection = event.fConnectionIds.length + event.fNodeIds.length === 1;
    this.selectionService.setTables(event.fNodeIds);
    this.changeDetectorRef.markForCheck();
  }

  public reassignConnection(event: FReassignConnectionEvent): void {
    if(!event.newFInputId) {
      return;
    }
    this.apiService.reassignConnection(event.fConnectionId, event.newFInputId);
    this.getData();
  }

  public createConnection(event: FCreateConnectionEvent): void {
    if (!event.fInputId) {
      return;
    }
    this.apiService.createConnection(event.fOutputId, event.fInputId, ETableRelationType.ONE_TO_ONE);
    this.getData();
  }

  public moveTable(point: IPoint, table: ITableViewModel): void {
    table.position = point;
    this.apiService.moveTable(table.id, point);
  }

  public onContextMenu(event: MouseEvent): void {
    this.contextMenuPosition = this.fFlowComponent.getPositionInFlow(
        PointExtensions.initialize(event.clientX, event.clientY)
    );
  }

}
