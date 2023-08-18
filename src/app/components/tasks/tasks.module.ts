import { NgModule } from '@angular/core';
import { BoardsComponent } from './boards/boards.component';
import { BoardComponent } from './boards/board/board.component';
import { BTasksComponent } from './boards/board/b-tasks/b-tasks.component';
import { BTaskComponent } from './boards/board/b-tasks/b-task/b-task.component';
import { CommonModule } from '@angular/common';
import { TasksRoutingModule } from './tasks-routing.module';
import { TaskDialogComponent } from './boards/board/b-tasks/task-dialog/task-dialog.component';

@NgModule({
  imports: [CommonModule, TasksRoutingModule],
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
