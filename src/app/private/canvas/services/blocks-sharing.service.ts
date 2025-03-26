import {Injectable} from '@angular/core';
import {ActionBlock, Block, BlockType, InputDataBlock} from "../../action-config/action-config.component";
import {BehaviorSubject} from "rxjs";
import {ActionParamResponseDTO} from "../../../api/model/actionParamResponseDTO";
import {RuleInputFieldResponseDTO} from "../../../api/model/ruleInputFieldResponseDTO";
import {RuleOutputFieldResponseDTO} from "../../../api/model/ruleOutputFieldResponseDTO";

export enum ConnectorDir{
    INPUT,
    OUTPUT
}

export interface IdConnector {
    id: string,
    blockKey: string,
    connectorType: ConnectorDir,
    type: BlockType;
}
export interface IdConnectorParam extends IdConnector{
    paramName?: string;
    paramType?: string;
    paramDirection?: ActionParamResponseDTO.ParamDirectionEnum; //Determina se connector di input o di Output
}
export interface IdConnectorDataField extends IdConnector{
    fieldName?: string;
    fieldType?: string;
}


@Injectable({
  providedIn: 'root'
})
export class BlocksSharingService {

  blocks: BehaviorSubject<Block[]> = new BehaviorSubject<Block[]>([]);
  connectorMapping: BehaviorSubject<IdConnector[] > =  new BehaviorSubject<IdConnector[] >([]);
  
  
  constructor() { }

  setBlocks(blocks: Block[]){
        this.blocks.next(blocks);
        this.resetConnectorMapping(blocks);
  }

  getBlocks(){
      return this.blocks.asObservable();
  }


  private resetConnectorMapping(blocks: Block[]) {
    let connectors: IdConnector[] = [];

    blocks.forEach((block: Block) =>{
        switch (block.type) {
            case BlockType.INPUT_DATA:
                const inputBlock = block as InputDataBlock;
                inputBlock.data.fields?.forEach((field:RuleInputFieldResponseDTO) => {
                    connectors.push({connectorType: ConnectorDir.INPUT, id: block.key+block.type+'_input_id'+block.name+'_'+field.fieldType+'_'+field.fieldName ,blockKey: block.key, type: BlockType.INPUT_DATA, fieldName: field.fieldName, fieldType: field.fieldType} as IdConnectorDataField);
                    connectors.push({connectorType: ConnectorDir.OUTPUT,id: block.key+block.type+'_output_id'+block.name+'_'+field.fieldType+'_'+field.fieldName ,blockKey: block.key, type: BlockType.INPUT_DATA, fieldName: field.fieldName, fieldType: field.fieldType} as IdConnectorDataField);
                });
                break;
            case BlockType.OUTPUT_DATA:
                const outputBlock = block as InputDataBlock;
                outputBlock.data.fields?.forEach((field:RuleOutputFieldResponseDTO) => {
                    connectors.push({connectorType: ConnectorDir.INPUT,id: block.key+block.type+'_output_id'+block.name+'_'+field.fieldType+'_'+field.fieldName,blockKey: block.key, type: BlockType.OUTPUT_DATA, fieldName: field.fieldName, fieldType: field.fieldType} as IdConnectorDataField);
                    connectors.push({connectorType: ConnectorDir.OUTPUT,id: block.key+block.type+'_output_id'+block.name+'_'+field.fieldType+'_'+field.fieldName,blockKey: block.key, type: BlockType.OUTPUT_DATA, fieldName: field.fieldName, fieldType: field.fieldType} as IdConnectorDataField);
                });
                break;
            case BlockType.ACTION:
                const actionBlock = block as ActionBlock;
                actionBlock.input?.forEach((param:ActionParamResponseDTO) => {
                    connectors.push({connectorType: ConnectorDir.INPUT ,id: block.key+block.type+'_input_id'+block.name+'_'+param.paramType+'_'+param.paramName,blockKey: block.key, type: BlockType.ACTION, paramName: param.paramName, paramType: param.paramType, paramDirection: param.paramDirection} as IdConnectorParam);
                });
                actionBlock.output?.forEach((param:ActionParamResponseDTO) => {
                    connectors.push({connectorType: ConnectorDir.OUTPUT,id: block.key+block.type+'_output_id'+block.name+'_'+param.paramType+'_'+param.paramName,blockKey: block.key, type: BlockType.ACTION, paramName: param.paramName, paramType: param.paramType, paramDirection: param.paramDirection} as IdConnectorParam);

                });
                break;
        }
    });
    if(connectors.length === 0){
        console.warn("resetting connector mapping with empty connectors");
        return;
    }
    this.connectorMapping.next(connectors)
  }

  getConnectorMapping(){
    return this.connectorMapping.asObservable();
  }

}
