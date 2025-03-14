import {ChangeDetectorRef, Component, Input, QueryList, ViewChildren} from '@angular/core';
import {ITableViewModel} from "../../../action-config-canvas-domain/table/i-table-view-model";
import {ETableColumnType} from "../../../action-config-canvas-domain/table/e-table-column-type";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, Subject, takeUntil} from "rxjs";
import {SelectionService} from "../../../action-config-canvas-domain/selection.service";
import {MatFormField} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatInput} from "@angular/material/input";
import {
  ActionConfigCanvasTableColumnComponent
} from "../action-config-canvas-table-column/action-config-canvas-table-column.component";
import {
  ActionConfigCanvasTableHeaderComponent
} from "../action-config-canvas-table-header/action-config-canvas-table-header.component";
import {FFlowModule} from "@foblex/flow";

@Component({
  selector: 'app-action-config-canvas-table',
  standalone: true,
  imports: [
    MatFormField,
    MatSelect,
    MatOption,
    MatInput,
    ReactiveFormsModule,
    ActionConfigCanvasTableColumnComponent,
    ActionConfigCanvasTableHeaderComponent,
    FFlowModule
  ],
  templateUrl: './action-config-canvas-table.component.html',
  styleUrls: ['./action-config-canvas-table.component.scss','./action-config-canvas-table.component.css']
})
export class ActionConfigCanvasTableComponent {


  @Input({ required: true })
  public viewModel!: ITableViewModel;

  protected columnTypes: string[] = Object.values(ETableColumnType);

  @ViewChildren(ActionConfigCanvasTableColumnComponent)
  private columns!: QueryList<ActionConfigCanvasTableColumnComponent>;

  private readonly destroy = new Subject<void>();

  @Input({ required: true })
  public form!: FormGroup;

  public getColumnForm(id: string): FormGroup {
    return (this.form.get('columns') as FormGroup).get(id) as FormGroup;
  }

  constructor(
      private selectionService: SelectionService,
      private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  public ngAfterViewInit(): void {
    this.subscribeToSelectionServiceSelectionChanges();
  }

  private subscribeToSelectionServiceSelectionChanges(): void {
    this.selectionService.selection$.pipe(takeUntil(this.destroy), debounceTime(5)).subscribe((x) => {
      const column = this.columns.find((c) => c.column.id === x.column);
      this.selectColumn(column);
    });
  }

  private selectColumn(column?: ActionConfigCanvasTableColumnComponent): void {
    this.columns.forEach((x) => x.select(x === column));
    this.changeDetectorRef.markForCheck();
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
