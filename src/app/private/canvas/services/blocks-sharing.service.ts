import { Injectable } from '@angular/core';
import {Block} from "../../action-config/action-config.component";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BlocksSharingService {

  blocks: BehaviorSubject<Block[]> = new BehaviorSubject<Block[]>([]);

  constructor() { }

  setBlocks(blocks: Block[]){
        this.blocks.next(blocks);
  }

  getBlocks(){
      return this.blocks.asObservable();
  }



}
