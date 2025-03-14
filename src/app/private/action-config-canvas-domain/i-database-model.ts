import {ITableViewModel} from "./table/i-table-view-model";
import {IGroupViewModel} from "./group/i-group-view-model";
import {ITableConnectionViewModel} from "./connection/i-table-connection-view-model";

export interface IDatabaseModel {

  tables: ITableViewModel[];

  groups: IGroupViewModel[];

  connections: ITableConnectionViewModel[];
}
