import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {
  EFMarkerType, FCanvasChangeEvent, FCanvasComponent, FCreateConnectionEvent,
  FCreateNodeEvent,
  FFlowComponent,
  FFlowModule,
  FSelectionChangeEvent,
  FZoomDirective
} from "@foblex/flow";
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
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from "@angular/material/table";
import {MatSlideToggle, MatSlideToggleChange} from "@angular/material/slide-toggle";
import {Condition, Rule} from "../rule-design/rule-design.component";
import {ActionControllerService} from "../../api/api/actionController.service";
import {ActionWithParamsResponseDTO} from "../../api/model/actionWithParamsResponseDTO";
import {ActionParamResponseDTO} from "../../api/model/actionParamResponseDTO";
import {IPoint} from "@foblex/core";
import {ActionConfigCanvasComponent} from "../canvas/action-config-canvas/action-config-canvas.component";

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
  position: IPoint
}

export interface InputDataBlock extends Block {
  type: BlockType.INPUT_DATA;
  idCondition: string,
  showFields: boolean,
  data: RuleInputResponseDTO;
}

export interface OutputDataBlock extends Block {
  type: BlockType.OUTPUT_DATA;
  showFields: boolean,
  idCondition: string,
  data: RuleOutputResponseDTO ;
}

export interface ActionBlock extends Block {
    type: BlockType.ACTION;
    input: ActionParamResponseDTO[];
    output: ActionParamResponseDTO[];
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
    MatHeaderRowDef,
    MatSlideToggle,
    MatSlideToggle,
    ActionConfigCanvasComponent
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

  @ViewChild(FCanvasComponent, { static: true })
  fCanvasComponent!: FCanvasComponent;


  @ViewChild(FFlowComponent, { static: true })
  fFlow!: FFlowComponent;

  @ViewChild('flow') flowElement!: ElementRef;

  @ViewChild('blockNode', { static: true }) blockNode!: ElementRef;


  connections: { outputId: string, inputId: string }[] = [];


  public fGroup!: FormGroup;

  projectId: string | null;
  ruleId: string | null;
  ruleData?: RuleDataResponseDTO;
  blocks: Block[] = [];

  private flowInstance: any;
  rule?: Rule;
  dataDropDownOptions: Condition[] = [];
  actionsDropDownOptions: ActionWithParamsResponseDTO[] = [];

  constructor(
      public route : ActivatedRoute,
      public ruleDataCacheService : RuleDataCacheService,
      public actionControllerService : ActionControllerService,
      public router : Router,
      private cdr: ChangeDetectorRef,
      private renderer: Renderer2
  ) {
    this.projectId = this.route.snapshot.queryParamMap.get('projectId');
    this.ruleId = this.route.snapshot.queryParamMap.get('ruleId');

    this.buildForm();
    this.getRuleData();
    this.fillNodeDropDownOptions();
  }

  ngOnInit() {
    this.getRuleData();
  }

  ngAfterViewInit() {
    this.fFlow.fLoaded.subscribe((data) => {
      // this.fZoomDirective.reset();
      // this.fFlow.redraw();
      // this.cdr.detectChanges();
      // this.cdr.markForCheck();
    });
    // this.fFlow.selectAll()
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
      dataBlock: new FormControl(null, [Validators.required]),
      actionBlock: new FormControl(null, [Validators.required]),
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


  isInputCondition(conditionClass?: string): boolean{
    return this.ruleData?.inputData?.map((id)=> id.className).includes(conditionClass as string) || false;
  }

  isInput(dataType: RuleInputResponseDTO | RuleOutputResponseDTO) {
    return this.ruleData?.inputData?.includes(dataType as RuleInputResponseDTO); //TODO make a more effifcient check like adding the input/output property to the DTO.
  }

  addBlock(action: boolean = false) {
    action ? this.addActionBlock() : this.addDataBlock();

    this.fFlow.redraw();
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  addDataBlock(){
    const dataBlockControl = this.getFormControl('dataBlock');

    if(dataBlockControl.invalid){
      console.error("Data block Form is invalid");
      return;
    }
    const selectedData : string = dataBlockControl.value as string;
    const selectedCondition = this.dataDropDownOptions.find((c)=> c.class === selectedData)

    if(selectedCondition === undefined){
      console.error("Failed to find selected condition");
      return;
    }

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
      this.blocks.push({showFields: false,idCondition: selectedCondition.idCondition, name: `${selectedCondition.idCondition} : ${selectedData}`,key: `input_${lastId+1}` ,position: {x:200,y : 200},type: BlockType.INPUT_DATA, data: data} as Block);
    }else {
      this.blocks.push({showFields: false,idCondition: selectedCondition.idCondition, name: `${selectedCondition.idCondition} : ${selectedData}` ,key: `output_${lastId+1}` ,position: {x:200,y : 200},type: BlockType.OUTPUT_DATA, data: data} as Block);
    }
    //remove from available options when it is created.
    this.dataDropDownOptions = this.dataDropDownOptions.filter((c)=> c.class !== selectedData)
  }

  addActionBlock(){
    const actionBlockControl = this.getFormControl('actionBlock');

    if(actionBlockControl.invalid){
      console.error("Data block Form is invalid");
      return;
    }
    const selectedAction = actionBlockControl.value as string;
    const action: ActionWithParamsResponseDTO | undefined = this.actionsDropDownOptions.find((a)=> a.actionName === selectedAction)

    if(action === undefined){
      console.error("Failed to find selected action");
      return;
    }
    const inputParams: ActionParamResponseDTO[] = action.actionParams?.filter((p: ActionParamResponseDTO)=> p.paramDirection === ActionParamResponseDTO.ParamDirectionEnum.INPUT ) || []
    const outputParams : ActionParamResponseDTO[] = action.actionParams?.filter((p: ActionParamResponseDTO)=> p.paramDirection === ActionParamResponseDTO.ParamDirectionEnum.OUTPUT) || []
    const lastId = this.blocks.length

    let toBePushed : ActionBlock = {
      type: BlockType.ACTION,
      key: `action_${lastId+1}`,
      position: {x:200,y : 200},
      name: action.actionName!,
      input: inputParams,
      output: outputParams
    }
    this.blocks.push(toBePushed as Block)
    console.warn(this.blocks)

  }

  onCreateNode($event: FCreateNodeEvent<any>) {
    this.cdr.markForCheck();
  }
  //This should be in a service class
  getClassName(block: Block) {
    return block.type === BlockType.INPUT_DATA ? (block as InputDataBlock).name ||'' : (block as OutputDataBlock).name ||''  ;
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
  getActionBlockDataSource(block: Block) {
    switch (block.type){
      case BlockType.ACTION:
        return [...(block as ActionBlock).input , ...(block as ActionBlock).output]
      default:
        console.error("invalid block type");
        return []
    }
  }


  isDataBlockShown(block: Block) {
     return block.type !== BlockType.ACTION && (block as InputDataBlock | OutputDataBlock).showFields
  }
  isActionBlockShown(block: Block) {
    return block.type === BlockType.ACTION && ((block as ActionBlock).input.length > 0 || (block as ActionBlock).output.length > 0)
  }

  getShowFields(block: Block) {
    return block.type !== BlockType.ACTION ? (block as InputDataBlock | OutputDataBlock).showFields : false
  }

  setShowFields(block: Block, $event: MatSlideToggleChange) {
    (block as InputDataBlock | OutputDataBlock).showFields = $event.checked
  }

  private fillNodeDropDownOptions() {
    if(!this.ruleId || !this.projectId) {
        console.error("Missing ids for project or rule");
        return;
    }

    this.ruleDataCacheService.getCachedRuleConditions(parseInt(this.projectId!), parseInt(this.ruleId!)).subscribe((rule: Rule) => {
      this.rule = rule;
      this.dataDropDownOptions = rule.conditions||[];
    });

    this.actionControllerService.getActionsWithParams().subscribe((actions: ActionWithParamsResponseDTO[]) => {
        this.actionsDropDownOptions = actions;
    });
  }


  isInputParam(param: ActionParamResponseDTO) {
    return param.paramDirection === ActionParamResponseDTO.ParamDirectionEnum.INPUT;
  }


  addConnection(event: FCreateConnectionEvent) {
    if(!event.fInputId) {
      return;
    }
    this.connections.push({ outputId: event.fOutputId, inputId: event.fInputId });
    this.cdr.detectChanges();
  }


  onLoaded($event: void) {
    this.fCanvasComponent.resetScaleAndCenter()

  }

  onCanvasChange($event: FCanvasChangeEvent) {
    console.warn("CANVAS" , $event)
  }

  onLoadedFFLow($event: void) {
    console.warn("FLOW " , $event)
    console.warn("FLOW " ,this.fFlow.getState())
  }
}
