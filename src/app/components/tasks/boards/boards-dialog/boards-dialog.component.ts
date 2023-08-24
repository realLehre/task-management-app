import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import * as fromStore from 'src/app/store/app.reducer';
import * as fromBoardsActions from '@boardsPageActions';
import { TaskService } from 'src/app/core/services/task.service';
import { Board } from 'src/app/shared/models/board.model';

interface boardForm {
  name: FormControl<string | null>;
  columns: FormArray<FormGroup<{ column: FormControl<string | null> }>>;
}
@Component({
  selector: 'app-boards-dialog',
  templateUrl: './boards-dialog.component.html',
  styleUrls: ['./boards-dialog.component.scss'],
})
export class BoardsDialogComponent implements OnInit {
  type!: string;
  createBoardForm!: FormGroup;
  board!: Board;
  editState: boolean = false;
  boardId!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.type = this.data.mode;
    this.editState = this.data.isAddColumn;

    this.createBoardForm = new FormGroup<boardForm>({
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

    this.store.select(fromStore.selectActiveBoard).subscribe((board) => {
      this.board = board ?? this.board;
      this.boardId = board?.id ?? this.boardId;

      if (this.editState == true) {
        this.name.setValue(board?.name);

        const columns = board?.columns ?? [];

        while (this.columns.length != 0) {
          this.columns.removeAt(0);
        }

        columns.map((column) => {
          this.columns.push(
            new FormGroup({
              column: new FormControl(column, Validators.required),
            })
          );
        });
      }
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

  onSubmit() {
    if (this.createBoardForm.invalid) {
      return;
    }
    const { name, columns } = this.createBoardForm.value;

    let newColumns = [];
    for (const key in columns) {
      newColumns.push(columns[key].column);
    }

    if (this.editState == true) {
      this.store.dispatch(
        fromBoardsActions.addColumn({
          board: {
            name: name,
            columns: newColumns,
            id: this.board?.id,
            tasks: [],
          },
        })
      );
    } else {
      this.store.dispatch(
        fromBoardsActions.createNewBoard({
          name: name,
          columns: newColumns,
          id: this.taskService.generateRandomString(),
          tasks: [],
        })
      );
    }

    this.dialog.closeAll();
  }

  onDeleteBoard() {
    this.store.dispatch(fromBoardsActions.deleteBoard({ id: this.boardId }));

    this.dialog.closeAll();
  }

  onCloseDialog() {
    this.dialog.closeAll();
  }
}
