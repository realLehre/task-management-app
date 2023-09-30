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
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { BoardsComponent } from './boards/boards.component';
import { BoardComponent } from './boards/board/board.component';
import { BTasksComponent } from './boards/board/b-tasks/b-tasks.component';
import { BTaskComponent } from './boards/board/b-tasks/b-task/b-task.component';
import { TasksRoutingModule } from './tasks-routing.module';
import { TaskDialogComponent } from './boards/board/b-tasks/task-dialog/task-dialog.component';
import { MaterialModule } from 'src/app/material.module';
import { BoardsDialogComponent } from './boards/boards-dialog/boards-dialog.component';
import * as fromStore from 'src/app/store/app.reducer';
import { SubTaskComponent } from './boards/board/b-tasks/task-dialog/sub-task/sub-task.component';
import { MobileBoardsComponent } from './boards/mobile-boards/mobile-boards.component';
import { ShortenBoardName } from 'src/app/shared/pipes/shorten-boardname.pipe';
import { EffectsModule } from '@ngrx/effects';
import { BoardsEffects } from './boards/boards-store/boards.effects';

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
    EffectsModule.forFeature([BoardsEffects]),
    NgxSkeletonLoaderModule,
  ],
  declarations: [
    BoardsComponent,
    BoardComponent,
    BTasksComponent,
    BTaskComponent,
    TaskDialogComponent,
    BoardsDialogComponent,
    SubTaskComponent,
    MobileBoardsComponent,
    ShortenBoardName,
  ],
  exports: [
    BoardsComponent,
    BoardComponent,
    BTasksComponent,
    BTaskComponent,
    TaskDialogComponent,
    BoardsDialogComponent,
    ShortenBoardName,
    EffectsModule,
  ],
})
export class TasksModule {}
