import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BTasksComponent } from './boards/board/b-tasks/b-tasks.component';

const routes: Routes = [{ path: '', component: BTasksComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TasksRoutingModule {}
