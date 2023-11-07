import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import * as fromStore from '@store';
import * as fromBoardsHttpActions from '@boardsHttpActions';
import { TaskService } from 'src/app/core/services/task.service';
import { Board } from 'src/app/shared/models/board.model';
import { Task } from 'src/app/shared/models/task.model';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

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
export class TaskDialogComponent implements OnInit, OnDestroy {
  checked = false;
  type!: string;
  isEdit: boolean = false;
  isEditing$!: Subscription;
  board!: Board | any;
  boardColumns: string[] = [];
  task!: Task;
  subTasks: Array<{ id: string; done: boolean; subtask: string }> = [];
  completedSubtasks: Array<{ id: string; done: boolean; subtask: string }> = [];
  storedSubtasks!: Array<{ id: string; done: boolean; subtask: string }> | any;
  storedCompletedSubtasks!:
    | Array<{ id: string; done: boolean; subtask: string }>
    | any;
  showError: boolean = false;
  boardTasks?: { [key: string]: Task[] };

  createTaskForm!: FormGroup;
  isSubmitting: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private store: Store<fromStore.State>,
    private taskService: TaskService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.type = this.data.type;
    this.isEdit = this.data.mode.isEdit;

    if (this.data.selectedTask) {
      this.task = this.data.selectedTask;
      localStorage.setItem('task', JSON.stringify(this.task));
      localStorage.setItem('prevStatus', this.task.status);

      this.subTasks = [...this.task.sub_tasks];
      this.completedSubtasks = [...this.task.completed_sub_tasks];
    }

    this.storedSubtasks = JSON.parse(
      localStorage.getItem('task') || '{}'
    ).sub_tasks;

    this.storedCompletedSubtasks = JSON.parse(
      localStorage.getItem('task') || '{}'
    ).completed_sub_tasks;

    this.store.select(fromStore.selectActiveBoard).subscribe((board) => {
      this.boardColumns = board?.columns ?? [];
      this.board = board ?? this.board;

      this.boardTasks = { ...this.board.tasks };
    });

    this.createTaskForm = new FormGroup<TaskForm>({
      title: new FormControl(null, Validators.required),
      description: new FormControl(null),
      subtasks: new FormArray([
        new FormGroup({
          subtask: new FormControl('', Validators.required),
        }),
        new FormGroup({
          subtask: new FormControl('', Validators.required),
        }),
      ]),
      status: new FormControl(this.board.columns[0], Validators.required),
    });

    if (this.isEdit) {
      this.title.setValue(this.task.title);
      this.description.setValue(this.task.description);
      this.status.setValue(this.task.status);
      const subtasks: string[] = [];
      this.task.sub_tasks.map((subtask) => {
        subtasks.push(subtask.subtask);
      });
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

  toggleCheck(id: string) {
    this.subTasks = this.subTasks.map((subtask) => {
      const newSubtask = { ...subtask };
      if (subtask.id == id) {
        newSubtask['done'] = !newSubtask['done'];
        if (newSubtask.done == true) {
          this.completedSubtasks = [...this.completedSubtasks, newSubtask];
        } else {
          this.completedSubtasks = this.completedSubtasks.filter(
            (subtask) => subtask.id !== newSubtask.id
          );
        }
      }
      return newSubtask;
    });

    this.storedSubtasks = this.subTasks;

    const newTask = {
      ...this.task,
      completed_sub_tasks: this.completedSubtasks,
      sub_tasks: this.subTasks,
    };

    this.task = newTask;

    let boardTasks = { ...this.board.tasks };
    let tasksToUpdate = this.board.tasks[this.task.status];

    tasksToUpdate = tasksToUpdate.map((task: Task) => {
      if (task.id == this.task.id) {
        return newTask;
      }

      return task;
    });

    boardTasks[this.task.status] = [...tasksToUpdate];

    this.taskService.board.next({
      ...this.board,
      tasks: { ...boardTasks },
    });

    // this.storedSubtasks =

    this.store.dispatch(
      fromBoardsHttpActions.updateBoard({
        board: {
          ...this.board,
          tasks: { ...boardTasks },
        },
      })
    );
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

    if (this.storedSubtasks) {
      this.storedSubtasks = this.storedSubtasks.filter(
        (task: any, storedIndex: number) => {
          if (storedIndex != index) {
            return task;
          }
          return;
        }
      );
    }
    if (this.storedCompletedSubtasks) {
      this.storedCompletedSubtasks = this.storedCompletedSubtasks.filter(
        (subtask: any) => {
          if (
            this.storedSubtasks.some(
              (storedSubtask: any) => storedSubtask.id == subtask.id
            )
          ) {
            return subtask;
          }
        }
      );
    }

    let boardTasks = { ...this.board.tasks };

    if (this.isEdit) {
      let tasksToUpdate = boardTasks[this.task.status];
      const newTask = {
        ...this.task,
        completed_sub_tasks: this.storedCompletedSubtasks,
        sub_tasks: this.storedSubtasks,
      };
      tasksToUpdate = tasksToUpdate.map((task: Task) => {
        if (task.id == this.task.id) {
          task = newTask;
        }
        return task;
      });
      boardTasks[this.task.status] = [...tasksToUpdate];
      this.boardTasks = boardTasks;
    }
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

    this.isSubmitting = true;

    const taskStored: Task = JSON.parse(localStorage.getItem('task') || '{}');

    let subtasks: Array<{ id: string; done: boolean; subtask: string }> = [];

    let newSubtask: { id: string; done: boolean; subtask: string };

    // create subtasks from subtasks input values
    for (const key in this.subtasks.value) {
      newSubtask = {
        id: this.taskService.generateRandomString(),
        done: false,
        subtask: this.subtasks.value[key].subtask,
      };

      subtasks.push(newSubtask);
    }

    let tasks: { [key: string]: Task[] } = { ...this.board.tasks };
    const prevStatus = localStorage.getItem('prevStatus');
    let task: Task;

    if (this.isEdit) {
      // change subtask name without changing its data
      const newStoredSubtasks: any[] = [];

      for (let d = 0; d < this.storedSubtasks.length; d++) {
        let newSubtask = {
          ...this.storedSubtasks[d],
          subtask: subtasks[d].subtask,
        };
        newStoredSubtasks.push(newSubtask);
      }

      // return only new subtask from overall subtasks (gotten from form)
      subtasks = subtasks.filter((subtask, index) => {
        if (index >= this.storedSubtasks.length) {
          return subtask;
        }
        return;
      });

      // spread both old subtasks (with name change) and new subtasks into subtasks
      subtasks = [...newStoredSubtasks, ...subtasks];

      task = {
        title: this.title.value,
        description: this.description.value,
        sub_tasks: [...subtasks],
        status: this.status.value,
        completed_sub_tasks: [...this.storedCompletedSubtasks],
        id: this.task.id,
      };

      // remove task from previous column if status changes
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
        this.isSubmitting = false;
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

      this.isEditing$ = this.taskService.isSubmitting.subscribe((status) => {
        if (!status) {
          this.isSubmitting = false;
          this.toastr.success('Task edited');
          this.dialog.closeAll();
        }
      });
    } else {
      task = {
        title: this.title.value,
        description: this.description.value,
        sub_tasks: [...subtasks],
        status: this.status.value,
        completed_sub_tasks: [],
        id: this.taskService.generateRandomString(),
      };

      for (const key in tasks) {
        if (task.status == key) {
          tasks[key] = [...tasks[key], task];
        }
      }

      this.isEditing$ = this.taskService.isSubmitting.subscribe((status) => {
        if (!status) {
          this.toastr.success('Task added');
          this.isSubmitting = false;
          this.dialog.closeAll();
        }
      });
    }

    this.store.dispatch(
      fromBoardsHttpActions.updateBoard({
        board: {
          ...this.board,
          tasks: { ...tasks },
        },
      })
    );

    // this.dialog.closeAll();
  }

  onDeleteTask() {
    this.isSubmitting = true;
    const taskStatus = this.task.status;
    const tasks = { ...this.board.tasks };

    tasks[taskStatus] = tasks[taskStatus].filter(
      (task: Task) => task.id != this.task.id
    );

    this.store.dispatch(
      fromBoardsHttpActions.updateBoard({
        board: {
          ...this.board,
          tasks: { ...tasks },
        },
      })
    );

    this.isEditing$ = this.taskService.isSubmitting.subscribe((status) => {
      if (!status) {
        this.isSubmitting = false;
        this.toastr.success('Task deleted');
      }
      this.dialog.closeAll();
    });
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  ngOnDestroy(): void {
    if (this.isEditing$) {
      this.isEditing$.unsubscribe();
    }
  }
}
