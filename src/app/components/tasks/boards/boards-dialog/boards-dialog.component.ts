import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import * as fromStore from 'src/app/store/app.reducer';
import * as fromBoardsActions from '@boardsPageActions';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';

@Component({
  selector: 'app-boards-dialog',
  templateUrl: './boards-dialog.component.html',
  styleUrls: ['./boards-dialog.component.scss'],
})
export class BoardsDialogComponent implements OnInit {
  type!: string;
  createBoardForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: string,
    private store: Store<fromStore.State>
  ) {}

  ngOnInit(): void {
    this.type = this.data;

    this.createBoardForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      columns: new FormArray([
        new FormGroup({
          column: new FormControl('Todo', Validators.required),
        }),
        new FormGroup({
          column: new FormControl('Doing', Validators.required),
        }),
      ]),
    });
  }

  get name() {
    return <FormControl>this.createBoardForm.get('name');
  }

  get columns() {
    return <FormArray>this.createBoardForm.get('columns');
  }

  addColumn() {
    this.columns.push(
      new FormGroup({
        column: new FormControl(null, Validators.required),
      })
    );
  }

  removeColumn(index: number) {
    this.columns.removeAt(index);
  }

  generateRandomString() {
    const randomChar =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567';

    let randomString = '';
    for (let d = 0; d < 10; d++) {
      randomString += randomChar.charAt(
        Math.floor(Math.random() * randomChar.length)
      );
    }
    return randomString;
  }

  onSubmit() {
    if (this.createBoardForm.invalid) {
      return;
    }
    const { name, columns } = this.createBoardForm.value;

    let newColumns = [];
    for (const key in columns) {
      newColumns.push(columns[key].column);
    }

    this.store.dispatch(
      fromBoardsActions.createNewBoard({
        name: name,
        columns: newColumns,
        id: this.generateRandomString(),
      })
    );
  }
}
