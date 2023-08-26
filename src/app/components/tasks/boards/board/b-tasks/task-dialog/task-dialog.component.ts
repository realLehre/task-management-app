import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import * as fromStore from '@store';
import * as fromTasksActions from '@tasksPageActions';

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
  boardColumns: string[] = [];

  createTaskForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private store: Store<fromStore.State>
  ) {}

  ngOnInit(): void {
    this.type = this.data.type;
    this.isEdit = this.data.mode.isEdit;

    this.store.select(fromStore.selectActiveBoard).subscribe((board) => {
      this.boardColumns = board?.columns ?? [];
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

    // this.store.dispatch(fromTasksActions.addTask)
  }

  get name() {
    return <FormControl>this.createTaskForm.get('name');
  }

  get description() {
    return <FormControl>this.createTaskForm.get('description');
  }

  get subtasks() {
    return <FormArray>this.createTaskForm.get('subtasks');
  }

  toggleCheck() {
    this.checked = !this.checked;
  }

  onSubmit() {
    console.log(this.createTaskForm);
  }
}
