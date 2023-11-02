import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import * as fromStore from '@store';
import { Board } from 'src/app/shared/models/board.model';
import { BoardsDialogComponent } from '../../boards-dialog/boards-dialog.component';
import { Task } from 'src/app/shared/models/task.model';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { TaskService } from 'src/app/core/services/task.service';

@Component({
  selector: 'app-b-tasks',
  templateUrl: './b-tasks.component.html',
  styleUrls: ['./b-tasks.component.scss'],
})
export class BTasksComponent implements OnInit {
  boards!: Board[];
  activeBoard: Board = {
    name: '',
    columns: [],
    id: '',
    tasks: {},
  };

  isFetching: boolean = false;
  tasks!: { [key: string]: Task[] };
  showTasks: boolean = false;
  theme!: string;

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.theme = localStorage.getItem('theme')!;
    this.taskService.isLoadingBoards.subscribe((status) => {
      this.isFetching = status;
      if (status == false) {
        this.store.select(fromStore.selectActiveBoard).subscribe((board) => {
          if (board?.id) {
            this.activeBoard = board ?? {};
            this.tasks = JSON.parse(JSON.stringify(this.activeBoard.tasks));
          }
        });
      }
    });

    this.store.select(fromStore.selectAllBoards).subscribe((boards) => {
      this.boards = boards ?? [];
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

  openModal(isAddColumn: boolean) {
    const dialogRef = this.dialog.open(BoardsDialogComponent, {
      panelClass: 'board_dialog',
      autoFocus: false,
      data: { mode: 'create', isAddColumn: isAddColumn },
    });
  }
}
