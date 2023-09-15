import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BTasksComponent } from './boards/board/b-tasks/b-tasks.component';
import { BoardsComponent } from './boards/boards.component';

const routes: Routes = [
  // { path: '', component: BoardsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TasksRoutingModule {}
