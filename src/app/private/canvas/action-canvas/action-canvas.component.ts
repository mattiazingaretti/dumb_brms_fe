import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewChild} from '@angular/core';
import {
  ActionBlock,
  Block,
  BlockType,
  InputDataBlock,
  OutputDataBlock
} from "../../action-config/action-config.component";
import {
  EFConnectionBehavior,
  EFMarkerType,
  FCanvasComponent,
  FCreateConnectionEvent,
  FFlowComponent,
  FFlowModule, FSelectionChangeEvent,
  FZoomDirective
} from "@foblex/flow";
import {BlocksSharingService} from "../services/blocks-sharing.service";
import {MatLabel} from "@angular/material/form-field";
import {AsyncPipe, NgIf} from "@angular/common";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import {MatChipRow} from "@angular/material/chips";
import {ActionParamResponseDTO} from "../../../api/model/actionParamResponseDTO";
import {MatIcon} from "@angular/material/icon";
import {MatButton} from "@angular/material/button";

export interface Connection{
  id: string;
  from: string;
  to: string;
  label?: string;
}


@Component({
  selector: 'app-action-canvas',
  standalone: true,
  imports: [
    FFlowModule,
    FZoomDirective,
    MatLabel,
    AsyncPipe,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatChipRow,
    MatCellDef,
    NgIf,
    MatHeaderRow,
    MatRow,
    MatTable,
    MatHeaderCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatIcon,
    MatButton
  ],
  templateUrl: './action-canvas.component.html',
  styleUrl: './action-canvas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class ActionCanvasComponent {
  protected readonly BlockType = BlockType;
  public eConnectionBehaviour = EFConnectionBehavior;
  protected readonly eMarkerType = EFMarkerType;

  blocks: Block[] = [];
  connections: Connection[] = [];
  idsMap: {[key: string]: Block} = {};

  @ViewChild('flowComponent', {static: true}) flowComponent!: FFlowComponent;
  @ViewChild('flowCanvas', {static: true}) flowCanvas!: FCanvasComponent;
  @ViewChild(FZoomDirective, { static: true }) fZoom!: FZoomDirective;

  selectedItems: {connectionsIds: string[], blockIds: string[]}= {blockIds: [], connectionsIds: []};

  constructor(
      public blocksSharingService: BlocksSharingService,
      private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.blocksSharingService.getBlocks().subscribe(blocks => {
      this.blocks = blocks;
      this.flowComponent.redraw()
      this.flowCanvas.redraw();
    })

  }


  isDataBlockShown(block: Block) {
    return block.type !== BlockType.ACTION
  }
  getDataBlockDataSource(block: Block) {
    switch (block.type){
      case BlockType.OUTPUT_DATA:
        return (block as OutputDataBlock).data.fields
      case BlockType.INPUT_DATA:
        return (block as InputDataBlock).data.fields
      default:
        console.error("invalid block type");
        return []
    }
  }

  isActionBlockShown(block: Block) {
    return block.type === BlockType.ACTION && ((block as ActionBlock).input.length > 0 || (block as ActionBlock).output.length > 0)
  }

  getActionBlockDataSource(block: Block) {
    switch (block.type){
      case BlockType.ACTION:
        return [...(block as ActionBlock).input , ...(block as ActionBlock).output]
      default:
        console.error("invalid block type");
        return []
    }
  }
  isInputParam(param: ActionParamResponseDTO) {
    return param.paramDirection === ActionParamResponseDTO.ParamDirectionEnum.INPUT;
  }

  addConnection(event: FCreateConnectionEvent) {
    if(!event.fInputId) {
      return;
    }
    const lastId = this.connections.length
    this.connections.push({ id: `connection_${lastId+1}`,to: event.fOutputId, from: event.fInputId });
    this.changeDetectorRef.detectChanges();
  }


  onSelectionchange($event: FSelectionChangeEvent) {
    this.selectedItems = {connectionsIds: $event.fConnectionIds, blockIds: $event.fNodeIds};
    this.changeDetectorRef.detectChanges()
}



  onZoomOut() {
    this.fZoom.zoomOut();
  }

  onZoomIn() {
    this.fZoom.zoomIn();
  }

  onZoomReset() {
    this.fZoom.reset();
  }


  onDelete() {
    this.blocks = this.blocks.filter((block) => ! this.selectedItems.blockIds.includes(block.key));
    console.warn(this.blocks)
    this.blocksSharingService.setBlocks(this.blocks);
    this.selectedItems.blockIds.forEach((id) => {
      this.connections = this.connections.filter((connection) => !(connection.from.includes(id) || connection.to.includes(id)))
    })
    this.flowCanvas.redraw();
    this.changeDetectorRef.detectChanges()
  }

}
