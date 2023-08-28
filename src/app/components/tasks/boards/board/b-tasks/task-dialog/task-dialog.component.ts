import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import * as fromStore from '@store';
import * as fromTasksActions from '@tasksPageActions';
import * as fromBoardsActions from '@boardsPageActions';
import { TaskService } from 'src/app/core/services/task.service';
import { Board } from 'src/app/shared/models/board.model';
import { Task } from 'src/app/shared/models/task.model';
import { Router } from '@angular/router';

interface TaskForm {
  title: FormControl<string | null>;
  description: FormControl<string | null>;
  subtasks: FormArray<FormGroup<{ subtask: FormControl<string | null> }>>;
  status: FormControl<string | null>;
}

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss'],
})
export class TaskDialogComponent implements OnInit {
  checked = false;
  type!: string;
  isEdit: boolean = false;
  board!: Board | any;
  boardColumns: string[] = [];

  createTaskForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private store: Store<fromStore.State>,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.type = this.data.type;
    this.isEdit = this.data.mode.isEdit;

    this.store.select(fromStore.selectActiveBoard).subscribe((board) => {
      this.boardColumns = board?.columns ?? [];
      this.board = board ?? this.board;
    });

    this.createTaskForm = new FormGroup<TaskForm>({
      title: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      subtasks: new FormArray([
        new FormGroup({
          subtask: new FormControl('', Validators.required),
        }),
        new FormGroup({
          subtask: new FormControl('', Validators.required),
        }),
      ]),
      status: new FormControl(null, Validators.required),
    });
  }

  get title() {
    return <FormControl>this.createTaskForm.get('title');
  }

  get description() {
    return <FormControl>this.createTaskForm.get('description');
  }

  get subtasks() {
    return <FormArray>this.createTaskForm.get('subtasks');
  }

  get status() {
    return <FormControl>this.createTaskForm.get('status');
  }

  toggleCheck() {
    this.checked = !this.checked;
  }

  addSubtask() {
    this.subtasks.push(
      new FormGroup({
        subtask: new FormControl('', Validators.required),
      })
    );
  }

  onSubmit() {
    if (this.createTaskForm.invalid) {
      return;
    }
    console.log(this.board.id);

    this.router.navigate(['tasks', this.board.id]);

    localStorage.setItem('board_id', this.board.id);

    let subtasks = [];

    for (const key in this.subtasks.value) {
      subtasks.push(this.subtasks.value[key].subtask);
    }

    let tasks: { [key: string]: Task[] } = { ...this.board.tasks };
    const task: Task = {
      title: this.title.value,
      description: this.description.value,
      sub_tasks: [...subtasks],
      status: this.status.value,
      id: this.taskService.generateRandomString(),
    };

    for (const key in tasks) {
      if (task.status == key) {
        tasks[key] = [...tasks[key], task];
      }
    }

    this.store.dispatch(
      fromBoardsActions.updateBoard({
        board: {
          ...this.board,
          tasks: { ...tasks },
        },
      })
    );
  }
}
