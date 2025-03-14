import { Injectable } from '@angular/core';
import { IPoint } from '@foblex/2d';
import { IDatabaseModel } from './i-database-model';
import { DATABASE_STORAGE, IDatabaseStorage } from './database.storage';

import { Observable, Subject } from 'rxjs';
import {ToConnectionViewModelHandler} from "./connection/map/to-connection-view-model.handler";
import {CreateTableHandler} from "./table/create-table/create-table.handler";
import {CreateColumnHandler} from "./table/create-column/create-column.handler";
import {RemoveColumnHandler} from "./table/remove-column/remove-column.handler";
import {MoveTableHandler} from "./table/move-table/move-table.handler";
import {MoveTableRequest} from "./table/move-table/move-table.request";
import {RemoveTableHandler} from "./table/remove-table/remove-table.handler";
import {RemoveTableRequest} from "./table/remove-table/remove-table.request";
import {ETableRelationType} from "./connection";
import {CreateConnectionHandler} from "./connection/create-connection/create-connection.handler";
import {RemoveConnectionRequest} from "./connection/remove-connection/remove-connection.request";
import {ChangeConnectionTypeRequest} from "./connection/change-connection-type/change-connection-type.request";
import {ReassignConnectionRequest} from "./connection/reassing-connection/reassign-connection.request";
import {ReassignConnectionHandler} from "./connection/reassing-connection/reassign-connection.handler";
import {ChangeConnectionTypeHandler} from "./connection/change-connection-type/change-connection-type.handler";
import {RemoveConnectionHandler} from "./connection/remove-connection/remove-connection.handler";
import {CreateConnectionRequest} from "./connection/create-connection/create-connection.request";
import {ChangeColumnKeyHandler} from "./table/change-column-key/change-column-key.handler";
import {ETableColumnKey} from "./table";
import {ChangeColumnKeyRequest} from "./table/change-column-key/change-column-key.request";
import {RemoveColumnRequest} from "./table/remove-column/remove-column.request";
import {ToGroupViewModelHandler} from "./group/map/to-group-view-model.handler";
import {ToTableViewModelHandler} from "./table/map/to-table-view-model.handler";
import {CreateTableRequest} from "./table/create-table/create-table.request";
import {CreateColumnRequest} from "./table/create-column/create-column.request";

@Injectable()
export class DatabaseApiService {

  private storage: IDatabaseStorage = DATABASE_STORAGE;

  private reload: Subject<EReloadReason> = new Subject<EReloadReason>();

  public get reload$(): Observable<EReloadReason> {
    return this.reload.asObservable();
  }

  public get(): IDatabaseModel {
    return {
      tables: new ToTableViewModelHandler(this.storage).handle(),
      groups: new ToGroupViewModelHandler(this.storage).handle(),
      connections: new ToConnectionViewModelHandler(this.storage).handle(),
    }
  }

  public createTable(position: IPoint): void {
    new CreateTableHandler(this.storage).handle(
      new CreateTableRequest(position)
    );
    this.reload.next(EReloadReason.JUST_RELOAD);
  }

  public createColumn(tableId: string): void {
    new CreateColumnHandler(this.storage).handle(
      new CreateColumnRequest(tableId)
    );
    this.reload.next(EReloadReason.JUST_RELOAD);
  }

  public removeColumn(tableId: string, columnId: string): void {
    new RemoveColumnHandler(this.storage).handle(
      new RemoveColumnRequest(tableId, columnId)
    );
    this.reload.next(EReloadReason.JUST_RELOAD);
  }

  public changeColumnKey(tableId: string, columnId: string, key: ETableColumnKey | null): void {
    new ChangeColumnKeyHandler(this.storage).handle(
      new ChangeColumnKeyRequest(tableId, columnId, key)
    );
    this.reload.next(EReloadReason.JUST_RELOAD);
  }

  public moveTable(id: string, position: IPoint): void {
    new MoveTableHandler(this.storage).handle(
      new MoveTableRequest(id, position)
    );
  }

  public removeTable(id: string): void {
    new RemoveTableHandler(this.storage).handle(
      new RemoveTableRequest(id)
    );
    this.reload.next(EReloadReason.JUST_RELOAD);
  }

  public createConnection(outputId: string, inputId: string, type: ETableRelationType): void {
    new CreateConnectionHandler(this.storage).handle(
      new CreateConnectionRequest(outputId, inputId, type)
    );
    this.reload.next(EReloadReason.JUST_RELOAD);
  }

  public reassignConnection(connectionId: string, inputId: string): void {
    new ReassignConnectionHandler(this.storage).handle(
      new ReassignConnectionRequest(connectionId, inputId)
    );
    this.reload.next(EReloadReason.JUST_RELOAD);
  }

  public changeConnectionType(connectionId: string, type: ETableRelationType): void {
    new ChangeConnectionTypeHandler(this.storage).handle(
      new ChangeConnectionTypeRequest(connectionId, type)
    );
    this.reload.next(EReloadReason.CONNECTION_CHANGED);
  }

  public removeConnection(connectionId: string): void {
    new RemoveConnectionHandler(this.storage).handle(
      new RemoveConnectionRequest(connectionId)
    );
    this.reload.next(EReloadReason.CONNECTION_CHANGED);
  }
}

export enum EReloadReason {

  JUST_RELOAD,

  CONNECTION_CHANGED,
}
