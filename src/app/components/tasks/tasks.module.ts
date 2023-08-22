import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  ActionReducer,
  ActionReducerMap,
  MetaReducer,
  StoreModule,
} from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

import { BoardsComponent } from './boards/boards.component';
import { BoardComponent } from './boards/board/board.component';
import { BTasksComponent } from './boards/board/b-tasks/b-tasks.component';
import { BTaskComponent } from './boards/board/b-tasks/b-task/b-task.component';
import { TasksRoutingModule } from './tasks-routing.module';
import { TaskDialogComponent } from './boards/board/b-tasks/task-dialog/task-dialog.component';
import { MaterialModule } from 'src/app/material.module';
import { BoardsDialogComponent } from './boards/boards-dialog/boards-dialog.component';
import * as fromStore from 'src/app/store/app.reducer';

const reducers = {
  boards: fromStore.getBoardsState,
};

function localStorageSyncReducer(
  reducer: ActionReducer<fromStore.State>
): ActionReducer<fromStore.State> {
  return localStorageSync({
    keys: [{ boards: ['boards'] }],
    rehydrate: true,
  })(reducer);
}

const metaReducers: Array<MetaReducer<fromStore.State, any>> = [
  localStorageSyncReducer,
];

@NgModule({
  imports: [
    CommonModule,
    TasksRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    BoardsComponent,
    BoardComponent,
    BTasksComponent,
    BTaskComponent,
    TaskDialogComponent,
    BoardsDialogComponent,
  ],
  exports: [
    BoardsComponent,
    BoardComponent,
    BTasksComponent,
    BTaskComponent,
    TaskDialogComponent,
    BoardsDialogComponent,
  ],
})
export class TasksModule {}
