import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import * as fromStore from '@store';
import * as fromTasksActions from '@tasksPageActions';
import * as fromBoardsActions from '@boardsPageActions';
import { TaskService } from 'src/app/core/services/task.service';
import { Board } from 'src/app/shared/models/board.model';
import { Task } from 'src/app/shared/models/task.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  task!: Task;
  showError: boolean = false;

  createTaskForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private store: Store<fromStore.State>,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.type = this.data.type;
    this.isEdit = this.data.mode.isEdit;
    if (this.data.selectedTask) {
      this.task = this.data.selectedTask;
      localStorage.setItem('prevStatus', this.task.status);
    }

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

    if (this.isEdit) {
      this.title.setValue(this.task.title);
      this.description.setValue(this.task.description);
      this.status.setValue(this.task.status);
      const subtasks = this.task.sub_tasks;
      while (this.subtasks.length != 0) {
        this.subtasks.removeAt(0);
      }

      subtasks.map((subtask) => {
        this.subtasks.push(
          new FormGroup({
            subtask: new FormControl(subtask, Validators.required),
          })
        );
      });
    }
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

  toggleCheck(index: any, e: any) {
    console.log(index);
    console.log(e.target);

    e.target.classList.toggle('strikethrough');

    // this.checked = !this.checked;
  }

  addSubtask() {
    this.subtasks.push(
      new FormGroup({
        subtask: new FormControl('', Validators.required),
      })
    );
  }

  removeSubtask(index: number) {
    this.subtasks.removeAt(index);
  }

  onEdit() {
    this.dialog.closeAll();

    const dialogRef = this.dialog.open(TaskDialogComponent, {
      panelClass: 'add_view_task_dialog',
      autoFocus: false,
      data: {
        type: 'add_task',
        mode: { isEdit: true },
        selectedTask: this.task,
      },
    });
  }

  onDelete() {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      panelClass: 'add_view_task_dialog',
      autoFocus: false,
      data: {
        type: 'delete_task',
        mode: { isEdit: false },
        selectedTask: this.task,
      },
    });
  }

  onSubmit() {
    if (this.createTaskForm.invalid) {
      this.showError = true;
      setTimeout(() => {
        this.showError = false;
      }, 1500);
      return;
    }

    localStorage.setItem('board_id', this.board.id);
    localStorage.setItem('board_name', this.board.name);
    this.router.navigate(['boards'], {
      queryParams: { board: this.board.name, board_Id: this.board.id },
    });

    let subtasks = [];

    for (const key in this.subtasks.value) {
      subtasks.push(this.subtasks.value[key].subtask);
    }

    let tasks: { [key: string]: Task[] } = { ...this.board.tasks };
    const prevStatus = localStorage.getItem('prevStatus');
    let task: Task;

    if (this.isEdit) {
      task = {
        title: this.title.value,
        description: this.description.value,
        sub_tasks: [...subtasks],
        status: this.status.value,
        id: this.task.id,
      };

      if (prevStatus && prevStatus != this.status.value) {
        tasks[prevStatus] = tasks[prevStatus].filter(
          (task) => task.id != this.task.id
        );
      }
      const index = tasks[this.status.value].findIndex((task) => {
        return task.id == this.task.id;
      });

      const newTask = task;
      if (
        tasks[this.status.value].some(
          (task) => JSON.stringify(task) === JSON.stringify(newTask)
        )
      ) {
        this.dialog.closeAll();
        return;
      }

      if (this.status.value == prevStatus) {
        tasks[this.status.value] = tasks[this.status.value].map((task) => {
          if (task.id == newTask.id) {
            return { ...task, ...newTask };
          }
          return task;
        });
      } else {
        tasks[this.status.value] = [...tasks[this.status.value], task];
      }
    } else {
      task = {
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
    }

    this.store.dispatch(
      fromBoardsActions.updateBoard({
        board: {
          ...this.board,
          tasks: { ...tasks },
        },
      })
    );

    this.dialog.closeAll();
  }

  onDeleteTask() {
    const taskStatus = this.task.status;
    const tasks = { ...this.board.tasks };

    tasks[taskStatus] = tasks[taskStatus].filter(
      (task: Task) => task.id != this.task.id
    );

    this.store.dispatch(
      fromBoardsActions.updateBoard({
        board: {
          ...this.board,
          tasks: { ...tasks },
        },
      })
    );

    this.dialog.closeAll();
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
