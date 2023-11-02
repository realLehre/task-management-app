import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import * as fromStore from 'src/app/store/app.reducer';
import * as fromBoardsActions from '@boardsPageActions';
import * as fromBoardsHttpActions from '@boardsHttpActions';
import { TaskService } from 'src/app/core/services/task.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

interface boardForm {
  name: FormControl<string | null>;
  columns: FormArray<FormGroup<{ column: FormControl<string | null> }>>;
}
@Component({
  selector: 'app-boards-dialog',
  templateUrl: './boards-dialog.component.html',
  styleUrls: ['./boards-dialog.component.scss'],
})
export class BoardsDialogComponent implements OnInit, OnDestroy {
  type!: string;
  createBoardForm!: FormGroup;
  board!: any;
  editState: boolean = false;
  boardId!: string;
  tasksStored!: any;
  showError: boolean = false;
  isSubmitting: boolean = false;
  isEditing$!: Subscription;
  isLoading$!: Subscription;
  storedColumns: string[] = [];
  oldStoredColumns: string[] = [];
  newStoredColumns: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
    private taskService: TaskService,
    private router: Router,
    private toastr: ToastrService
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
      this.storedColumns = [...this.board.columns];
      this.boardId = board?.id ?? this.boardId;
      localStorage.setItem('boardColumns', JSON.stringify(board?.columns));
      localStorage.setItem('tasks', JSON.stringify(this.board.tasks));

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

        try {
          const boardColumns = JSON.parse(
            localStorage.getItem('boardColumns')!
          );
          this.columns.controls.filter((column, index) => {
            if (index <= boardColumns.length) {
              // column.disable();
            }
          });
        } catch {}
      }
    });

    this.tasksStored = JSON.parse(localStorage.getItem('tasks') || '{}');

    this.taskService.isSubmitting.subscribe((status) => {
      this.isSubmitting = status;
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

  removeColumn(index: number, taskKey: { column: string }) {
    this.columns.controls.forEach((control, ctrlIndex) => {
      if (index == ctrlIndex) {
        control.enable();
        this.columns.removeAt(index);
      }
    });

    delete this.tasksStored[taskKey.column];

    localStorage.setItem('tasks', JSON.stringify(this.tasksStored));

    this.storedColumns = this.storedColumns.filter((column, columnIndex) => {
      if (columnIndex !== index) {
        return column;
      }
      return;
    });
  }

  onSubmit() {
    if (this.createBoardForm.invalid) {
      this.showError = true;
      setTimeout(() => {
        this.showError = false;
      }, 1500);
      return;
    }
    const { name, columns } = this.createBoardForm.getRawValue();

    let newColumns: string[] = [];
    const tasks: any = {};
    for (const key in columns) {
      if (newColumns.includes(columns[key].column.toLowerCase())) {
        this.toastr.warning('Column names can not be equal!');
        return;
      }
      newColumns.push(columns[key].column.toLowerCase());

      tasks[columns[key].column.toLowerCase()] = [];
    }

    const generatedId = this.taskService.generateRandomString();

    if (this.editState == true) {
      let newStoredColumnsX = [];
      for (let d = 0; d < this.storedColumns.length; d++) {
        const column = newColumns[d];

        // if column name is changed, replace tasks with previous task (don't return empty array)
        tasks[column] = this.tasksStored[this.storedColumns[d]];

        newStoredColumnsX.push(column);
      }

      this.newStoredColumns = newStoredColumnsX;
      this.oldStoredColumns = this.storedColumns;

      // checking to add old columns to new one without losing data
      newColumns = newColumns.filter((subtask, index) => {
        if (index >= this.storedColumns.length) {
          return subtask;
        }
        return;
      });

      newColumns = [...newStoredColumnsX, ...newColumns];

      this.store.dispatch(
        fromBoardsHttpActions.updateBoard({
          board: {
            name: name,
            columns: newColumns,
            id: this.board?.id,
            tasks: { ...tasks },
          },
        })
      );

      this.isEditing$ = this.taskService.isSubmitting.subscribe((status) => {
        if (!status) {
          this.editState = false;
          localStorage.setItem('board_id', this.board.id);
          localStorage.setItem('board_name', this.board.name);
          this.router.navigate(['boards'], {
            queryParams: { board: this.board.name, board_Id: this.board.id },
          });

          this.toastr.success('Board edited');
          this.dialog.closeAll();
        }
      });
    } else {
      this.store.dispatch(
        fromBoardsHttpActions.createBoard({
          board: {
            name: name,
            columns: newColumns,
            id: generatedId,
            tasks: { ...tasks },
          },
        })
      );

      this.isEditing$ = this.taskService.isSubmitting.subscribe((status) => {
        if (!status) {
          this.editState = false;
          localStorage.setItem('board_name', name);
          localStorage.setItem('board_id', generatedId);
          this.router.navigate(['boards'], {
            queryParams: { board: name, board_Id: generatedId },
          });
          this.store.dispatch(
            fromBoardsActions.selectBoard({ id: generatedId })
          );

          this.toastr.success('Board added');

          this.dialog.closeAll();
        }
      });
    }
  }

  onDeleteBoard() {
    if (this.board.id) {
      this.store.dispatch(
        fromBoardsHttpActions.deleteBoard({ id: this.boardId })
      );
    }

    this.isEditing$ = this.taskService.isSubmitting.subscribe({
      next: (status) => {
        if (status == false) {
          this.store.select(fromStore.selectAllBoards).subscribe((boards) => {
            if (boards.length > 0) {
              this.store.dispatch(
                fromBoardsActions.selectBoard({ id: boards[0].id })
              );

              this.router.navigate(['boards'], {
                queryParams: { board: boards[0].name, board_Id: boards[0].id },
              });
              localStorage.setItem('board_id', boards[0].id);
              localStorage.setItem('board_name', boards[0].name);
            }
          });
          this.toastr.success('Board deleted');

          this.dialog.closeAll();
        }
      },
      error: (err) => {},
    });
  }

  onCloseDialog() {
    this.dialog.closeAll();
  }

  ngOnDestroy(): void {
    if (this.isEditing$) {
      this.isEditing$.unsubscribe();
    }
  }
}
