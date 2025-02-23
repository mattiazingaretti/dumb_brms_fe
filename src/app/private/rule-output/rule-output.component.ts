import {Component, ElementRef, Input, QueryList, ViewChildren} from '@angular/core';
import {AsyncPipe, NgIf} from "@angular/common";
import {CtaComponent} from "../../shared/cta/cta.component";
import {DynamicFormFieldComponent} from "../../shared/dynamic-form-field/dynamic-form-field.component";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCard, MatCardActions, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
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
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {BehaviorSubject, debounceTime, Observable, Subscription} from "rxjs";
import {DesignControllerService} from "../../api/api/designController.service";
import {ActivatedRoute} from "@angular/router";
import {LocalKeys} from "../../app.routes";
import {uniqueDataType, validateDataIdentifier} from "../../shared/validators/rule-input.validator";
import {PostedResourceDTO} from "../../model/postedResourceDTO";
import {CardData} from "../rule-input/rule-input.component";
import {RuleOutputResponseDTO} from "../../api/model/ruleOutputResponseDTO";
import {RuleOutputRequestDTO} from "../../api/model/ruleOutputRequestDTO";
import {RuleOutputFieldResponseDTO} from "../../api/model/ruleOutputFieldResponseDTO";
import {RuleDesignDataSharingService} from "../../shared/services/rule-design-data-sharing.service";
import {RuleDataResponseDTO} from "../../api/model/ruleDataResponseDTO";

@Component({
  selector: 'app-rule-output',
  standalone: true,
    imports: [
        AsyncPipe,
        CtaComponent,
        DynamicFormFieldComponent,
        FormsModule,
        MatAutocomplete,
        MatAutocompleteTrigger,
        MatButton,
        MatCard,
        MatCardActions,
        MatCardHeader,
        MatCardSubtitle,
        MatCardTitle,
        MatCell,
        MatCellDef,
        MatColumnDef,
        MatError,
        MatFormField,
        MatHeaderCell,
        MatHeaderRow,
        MatHeaderRowDef,
        MatIcon,
        MatIconButton,
        MatInput,
        MatLabel,
        MatOption,
        MatRow,
        MatRowDef,
        MatTable,
        NgIf,
        ReactiveFormsModule,
        MatHeaderCellDef
    ],
  templateUrl: './rule-output.component.html',
  styleUrl: './rule-output.component.css'
})
export class RuleOutputComponent {
    subscriptions: Subscription[] = [];
    needToBeSaved: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    @Input() options: string[] = []//['NUMERIC', 'BOOLEAN', 'STRING', 'NUMERIC[]', 'STRING[]', 'BOOLEAN[]','NUMERIC{}', 'STRING{}', 'BOOLEAN{}'  ];
    @Input() ruleData?: Observable<RuleDataResponseDTO>

    cards: CardData[] = []

    @ViewChildren('input') input!: QueryList<ElementRef<HTMLInputElement>>;

    displayedColumns: string[] = ['toDelete','dataType', 'identifier'];
    projectId?: string | null;


    constructor(
        public designControllerService: DesignControllerService,
        public ruleDesignDataSharingService: RuleDesignDataSharingService,
        private route: ActivatedRoute
    ){
    }

    ngOnInit(): void {
        this.projectId = this.route.snapshot.queryParamMap.get('id');
        if(this.projectId == null){
            console.error("Project Id is null");
        }
        const ruleOutput = localStorage.getItem(LocalKeys.RULE_OUTPUT)
        const ruleFormData = localStorage.getItem(LocalKeys.RULE_OUTPUT_FORM_DATA)
        if(ruleOutput != null && ruleFormData != null){
            let ruleOutputJson = JSON.parse(ruleOutput)
            let ruleInputFormJson = JSON.parse(ruleFormData)
            let almostCards = ruleOutputJson.map((c: {id: number, filteredOptions: string[], dataSource: {dataIdentifier: string, dataType: string}[]}) =>
                {return {id: c.id, readOnly: true, filteredOptions: c.filteredOptions, fGroup: this.generateFgroup(), dataSource: c.dataSource}}
            )
            almostCards.forEach((c: CardData, index: number) => {
                c.fGroup.patchValue(ruleInputFormJson[index])
            })
            this.cards = almostCards
            this.updateSubscriptions()
        }else{

            if(ruleOutput == null || ruleFormData == null) {
                this.ruleData?.subscribe((data: RuleDataResponseDTO) => {
                    let almostCards :any = data.outputData!.map((c: RuleOutputResponseDTO , i: number) =>{
                        let dataSrc = c.fields?.map((field: RuleOutputFieldResponseDTO) =>  {return {dataIdentifier: field.fieldName, dataType: field.fieldType}}) ?? []
                        return {id: i, readOnly: true, filteredOptions: this.options.slice(), fGroup: this.generateFgroup(), dataSource: dataSrc};
                    });
                    almostCards.forEach((c: any, index: number) => {
                        c.fGroup.get('title')?.patchValue(data.outputData![index].className)
                        c.fGroup.get('descr')?.patchValue(data.outputData![index].classDescription)
                    });
                    this.cards = almostCards
                    this.updateSubscriptions()
                });
            }

        }
    }



    updateSubscriptions(){
        this.subscriptions.push(this.needToBeSaved.subscribe((b: boolean) => {
            if(b){
                this.onSave(false)
                console.log("saving without forcing")
            }
        }));
        this.cards.forEach((c: CardData) => {
            this.subscriptions.push(c.fGroup.valueChanges.pipe(debounceTime(300)).subscribe((val) => {
                this.needToBeSaved.next(true)
                console.log("need to be saved")
                console.log(val)
            }));
        });
    }


    getFormControl(card: CardData, arg: string): FormControl {
        return (card.fGroup.get(arg) as FormControl) ?? new FormControl('');
    }

    getCardFormGroup(card: CardData): FormGroup {
        return card.fGroup;
    }


    onClickedAddField(card: CardData) {

        const dataType = card.fGroup.get('dataType')?.value
        const dataId = card.fGroup.get('dataIdentifier')?.value

        const found = card.dataSource.find(d => d.dataIdentifier == dataId && d.dataType == dataType)

        if(found === undefined){
            card.dataSource =  [...card.dataSource,{dataIdentifier: dataId, dataType: dataType}]
        }else{
            card.fGroup.setErrors({hasDuplicate: true})
        }

    }


    filter(card: CardData,index : number) {
        const filterValue = this.input.get(index)?.nativeElement.value.toLowerCase();
        if(filterValue != undefined)
            card.filteredOptions = this.options.filter(o => o.toLowerCase().includes(filterValue));
    }

    onClickedSave(card: CardData) {
        card.readOnly = true
    }


    generateFgroup(){
        const fGroup : FormGroup = new FormGroup({
            title: new FormControl<string>('DataType',[Validators.required, validateDataIdentifier, uniqueDataType(  this.cards?.map(c => c.fGroup.get('title')?.value) || [] )]),
            descr: new FormControl<string>('DataType Descr',[]),
            dataType: new FormControl<string>('', [Validators.required]),
            dataIdentifier: new FormControl<string>('', [Validators.required, validateDataIdentifier])
        });
        return fGroup;
    }

    onClickAddCard() {
        const maxId : number = this.cards.length > 0 ? this.cards.reduce((a,b)=> a.id > b.id  ? a : b)?.id : 0;
        let newCard = {id: maxId + 1, filteredOptions: this.options.slice(), readOnly: false , fGroup: this.generateFgroup(), dataSource: []}
        this.cards = [...this.cards, newCard]
        this.updateSubscriptions()
        // newCard.fGroup.valueChanges.subscribe(() => {
        //     this.needToBeSaved.next(true)
        // });
    }


    onDeleteCard(card: CardData) {
        this.cards = [...this.cards.filter(c => c.id != card.id)]
        this.updateSubscriptions()
    }

    onDeleteCardField(card: CardData,cardField:  {dataIdentifier: string, dataType: string}) {
        card.dataSource = card.dataSource.length > 0 ?  card.dataSource.filter(d => d.dataIdentifier !== cardField.dataIdentifier || d.dataType !== cardField.dataType) : []
        card.dataSource  = [...card.dataSource]
    }

    getDisplayedColumns(card: CardData): Iterable<string> {
        return card.readOnly ?  this.displayedColumns.filter(c => c !== 'toDelete') : this.displayedColumns
    }

    onSave(force:boolean = false) {
        localStorage.setItem(LocalKeys.RULE_OUTPUT, JSON.stringify(this.cards.map((c: CardData) => {return {id: c.id,filteredOptions: c.filteredOptions, dataSource: c.dataSource}})))
        localStorage.setItem(LocalKeys.RULE_OUTPUT_FORM_DATA, JSON.stringify(this.cards.map((c: CardData) => {return c.fGroup.value})))
        if(force){
            let payload : RuleOutputRequestDTO[] = []
            this.cards.forEach((c: CardData) => {
                let item : RuleOutputRequestDTO ={
                    projectId: parseInt(this.projectId!),
                    className: c.fGroup.get('title')?.value,
                    classDescription: c.fGroup.get('descr')?.value,
                    fields: c.dataSource?.map((d)=>{return{fieldName: d.dataIdentifier, fieldType: d.dataType}}) || []
                }
                payload.push(item)
            })
            this.designControllerService.addRuleOutputData(payload).subscribe((res: PostedResourceDTO) => {
                if(res.success){
                    this.needToBeSaved.next(false);
                    this.ruleDesignDataSharingService.setDataRefresh(true);
                }
            });
        }

    }


    ngOnDestroy(): void {
        this.needToBeSaved.complete()
        this.subscriptions.forEach(s => s.unsubscribe())
        localStorage.removeItem(LocalKeys.RULE_OUTPUT_FORM_DATA)
        localStorage.removeItem(LocalKeys.RULE_OUTPUT)
    }
}
