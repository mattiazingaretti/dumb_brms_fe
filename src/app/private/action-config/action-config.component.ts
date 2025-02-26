import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';
import {EFMarkerType, FCreateNodeEvent, FFlowComponent, FFlowModule, FZoomDirective} from "@foblex/flow";
import {FooterComponent} from "../../shared/footer/footer.component";
import {MatButtonModule} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatFormField, MatOption, MatSelect, MatSelectModule} from "@angular/material/select";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatLabel} from "@angular/material/form-field";
import {ActivatedRoute, Router} from "@angular/router";
import {AppPaths} from "../../app.routes";
import {DynamicFormFieldComponent} from "../../shared/dynamic-form-field/dynamic-form-field.component";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {RuleDataCacheService} from "../../shared/services/rule-data-cache.service";
import {RuleDataResponseDTO} from "../../api/model/ruleDataResponseDTO";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {NgForOf, NgIf} from "@angular/common";
import {MatChipRow} from "@angular/material/chips";
import {RuleInputResponseDTO} from "../../api/model/ruleInputResponseDTO";
import {RuleOutputResponseDTO} from "../../api/model/ruleOutputResponseDTO";
import {FSelectionChangeEvent} from "@foblex/flow"
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";

export interface Workflow {
  name: string;
}

export enum BlockType {
  INPUT_DATA,
  OUTPUT_DATA,
  ACTION
}

export interface Block{
  name: string,
  type: BlockType;
  key: string,
  position: {x: number, y: number}
}

export interface InputDataBlock extends Block {
  type: BlockType.INPUT_DATA;
  data: RuleInputResponseDTO ;
}

export interface OutputDataBlock extends Block {
  type: BlockType.OUTPUT_DATA;
  data: RuleInputResponseDTO ;
}

export interface ActionBlock extends Block {
    type: BlockType.ACTION;
}

@Component({
  selector: 'app-action-config',
  standalone: true,
  imports: [
    FFlowModule,
    FooterComponent,
    FZoomDirective,
    MatButtonModule,
    MatIcon,
    MatSelect,
    MatOption,
    MatSidenavContent,
    MatSidenavContainer,
    MatFormField,
    MatSidenav,
    MatLabel,
    DynamicFormFieldComponent,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    MatSelectModule,
    ReactiveFormsModule,
    NgForOf,
    MatChipRow,
    NgIf,
    ReactiveFormsModule,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatHeaderRowDef
  ],
  templateUrl: './action-config.component.html',
  styleUrls: ['./action-config.component.css','./action-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class ActionConfigComponent {
  protected readonly BlockType = BlockType;
  protected readonly eMarkerType = EFMarkerType;

  @ViewChild(MatSidenav, { static: true })
  sidenav!: MatSidenav;

  @ViewChild(FZoomDirective, { static: true })
  fZoomDirective!: FZoomDirective;

  @ViewChild(FFlowComponent, { static: true })
  fFlow!: FFlowComponent;

  @ViewChild('flow') flowElement!: ElementRef;

  workflow?: Workflow;
  public fGroup!: FormGroup;

  projectId: string | null;
  ruleId: string | null;
  ruleData?: RuleDataResponseDTO;
  blocks: Block[] = [];

  private flowInstance: any;

  constructor(
      public route : ActivatedRoute,
      public ruleDataCacheService : RuleDataCacheService,
      public router : Router,
      private cdr: ChangeDetectorRef
  ) {
    this.projectId = this.route.snapshot.queryParamMap.get('projectId');
    this.ruleId = this.route.snapshot.queryParamMap.get('ruleId');

    this.buildForm();
    this.getRuleData();
  }

  ngOnInit() {
    this.getRuleData();
  }

  ngAfterViewInit() {
    this.fFlow.fLoaded.subscribe((data) => {
      console.warn(data);
    });
    this.fFlow.selectAll()
    console.log('Flow Module', FFlowModule);
    console.log('Flow Module');
  }

  zoomIn(): void {
    this.fZoomDirective.zoomIn();
  }
  zoomOut(): void {
    this.fZoomDirective.zoomOut();
  }

  reset(): void {
    this.fZoomDirective.reset();
  }


  onFunctionSelect(functionName: string): void {
    console.log(`Selected function: ${functionName}`);
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }

  save() {

  }

  backToRuleSettings() {
    this.router.navigate([AppPaths.DESIGN_BOARD], { queryParams: { id: this.projectId} });
  }

  private buildForm() {
    this.fGroup = new FormGroup({
      workflowName: new FormControl('[Workflow Name]', [Validators.required]),
      dataBlock: new FormControl(null, [Validators.required])
    })
  }

  getFormControl(controlName: string) {
    return this.fGroup.controls[controlName] as FormControl;
  }


  private getRuleData() {
    if(!this.ruleId || !this.projectId) {
      console.error("Missing ids for project or rule");
      return;
    }
    this.ruleDataCacheService.getCachedRuleData(parseInt(this.projectId)).subscribe((ruleData: RuleDataResponseDTO)=>{
        this.ruleData = ruleData;
    });
  }

  getDataTypes() {
    return [...this.ruleData?.inputData||[], ...this.ruleData?.outputData||[]]
  }

  isInput(dataType: RuleInputResponseDTO | RuleOutputResponseDTO) {
    return this.ruleData?.inputData?.includes(dataType as RuleInputResponseDTO); //TODO make a more effifcient check like adding the input/output property to the DTO.
  }

  addDataBlock() {
    const dataBlockControl = this.getFormControl('dataBlock');

    if(dataBlockControl.invalid){
      console.error("Data block Form is invalid");
      return;
    }
    const selectedData : string = dataBlockControl.value as string;
    let data: RuleOutputResponseDTO | RuleInputResponseDTO | undefined = undefined
    let inData: RuleInputResponseDTO | undefined = this.ruleData?.inputData?.find((id)=> id.className === selectedData)
    let outData :RuleOutputResponseDTO | undefined= this.ruleData?.outputData?.find((id)=> id.className === selectedData)

    data  = inData === undefined ? outData === undefined ? undefined : outData : inData

    const lastId = this.blocks.length

    if(data === undefined){
      console.error("failed to get dto from selected class");
      return;
    }

    if(this.isInput(data)) {
      this.blocks.push({name: selectedData,key: `input_${lastId+1}` ,position: {x:200,y : 200},type: BlockType.INPUT_DATA, data: data} as Block);
    }else {
        this.blocks.push({name: selectedData,key: `output_${lastId+1}` ,position: {x:200,y : 200},type: BlockType.OUTPUT_DATA, data: data} as Block);
    }
    this.fFlow.redraw();
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  onCreateNode($event: FCreateNodeEvent<any>) {
    this.cdr.markForCheck();
  }

  getClassName(block: Block) {
    return block.type === BlockType.INPUT_DATA ? (block as InputDataBlock).data?.className||'' : (block as OutputDataBlock).data?.className||''  ;
  }

  onSelectionChange(event: FSelectionChangeEvent) {
    console.warn(event)
  }

  getDataSource(block: Block) {
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
}
