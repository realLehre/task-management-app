import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { BoardsComponent } from './boards/boards.component';
import { BoardComponent } from './boards/board/board.component';
import { BTasksComponent } from './boards/board/b-tasks/b-tasks.component';
import { BTaskComponent } from './boards/board/b-tasks/b-task/b-task.component';
import { TasksRoutingModule } from './tasks-routing.module';
import { TaskDialogComponent } from './boards/board/b-tasks/task-dialog/task-dialog.component';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  imports: [CommonModule, TasksRoutingModule, MaterialModule, FormsModule],
  declarations: [
    BoardsComponent,
    BoardComponent,
    BTasksComponent,
    BTaskComponent,
    TaskDialogComponent,
  ],
  exports: [BoardsComponent, BoardComponent, BTasksComponent, BTaskComponent],
})
export class TasksModule {}
