import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import * as fromStore from '@store';
import { switchMap } from 'rxjs';
import { Board } from 'src/app/shared/models/board.model';
import { BoardsDialogComponent } from '../../boards-dialog/boards-dialog.component';
import { Task } from 'src/app/shared/models/task.model';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';

@Component({
  selector: 'app-b-tasks',
  templateUrl: './b-tasks.component.html',
  styleUrls: ['./b-tasks.component.scss'],
})
export class BTasksComponent implements OnInit {
  test: any = 6;
  activeBoard: Board | any = {
    name: '',
    columns: [],
    id: '',
    tasks: {},
  };
  tasks!: { [key: string]: Task[] };
  showTasks: boolean = false;

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.store.select(fromStore.selectActiveBoard).subscribe((board) => {
      this.activeBoard = { ...board };

      const tasks = structuredClone(this.activeBoard.tasks);
      this.tasks = tasks;
      // this.tasks = JSON.parse(JSON.stringify(tasks));
    });
  }

  onAddBoard_Column(type: string) {
    if (type == 'column') {
      this.openModal(true);
    } else if (type == 'board') {
      this.openModal(false);
    }
  }

  onViewTask(task: Task) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      panelClass: 'add_view_task_dialog',
      autoFocus: false,
      data: { type: 'view_task', mode: { isEdit: false }, selectedTask: task },
    });
  }

  openModal(isAddColuimn: boolean) {
    const dialogRef = this.dialog.open(BoardsDialogComponent, {
      panelClass: 'board_dialog',
      autoFocus: false,
      data: { mode: 'create', isAddColumn: isAddColuimn },
    });
  }
}
