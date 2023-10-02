import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Store } from '@ngrx/store';

import { Task } from 'src/app/shared/models/task.model';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import * as fromStore from '@store';
import * as fromBoardsHttpActions from '@boardsHttpActions';
import { Board } from 'src/app/shared/models/board.model';

@Component({
  selector: 'app-b-task',
  templateUrl: './b-task.component.html',
  styleUrls: ['./b-task.component.scss'],
})
export class BTaskComponent implements OnInit {
  @Input() tasks: Task[] = [];
  @Input() allTasks!: { [key: string]: Task[] };
  @Input() columnName: string[] = [];
  board: Board | any = {
    name: '',
    columns: [],
    id: '',
    tasks: {},
  };
  @Output() taskSelected = new EventEmitter<Task>();

  constructor(
    private dialog: MatDialog,
    private store: Store<fromStore.State>
  ) {}

  ngOnInit(): void {}

  onViewTask(task: Task) {
    this.taskSelected.emit(task);
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      panelClass: 'add_view_task_dialog',
      autoFocus: false,
      data: { type: 'view_task', mode: { isEdit: false }, selectedTask: task },
    });
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    const id = event.container.id;
    const index = +id.slice(-1);

    const newTask = { ...event.container.data[event.currentIndex] };
    newTask['status'] = this.columnName[index];

    let newColumnTasks: any[] = [...this.allTasks[this.columnName[index]]];

    newColumnTasks = newColumnTasks.map((task) => {
      if (task.id == newTask.id) {
        task['status'] = this.columnName[index];
      }
      return task;
    });

    this.allTasks[this.columnName[index]] = newColumnTasks;

    this.store.select(fromStore.selectActiveBoard).subscribe((board) => {
      this.board = { ...board };
    });

    this.store.dispatch(
      fromBoardsHttpActions.updateBoard({
        board: {
          ...this.board,
          tasks: { ...this.allTasks },
        },
      })
    );
  }
}
