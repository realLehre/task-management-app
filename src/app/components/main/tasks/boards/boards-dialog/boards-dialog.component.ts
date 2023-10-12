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
      this.boardId = board?.id ?? this.boardId;
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
    this.columns.removeAt(index);

    delete this.tasksStored[taskKey.column];
    localStorage.setItem('tasks', JSON.stringify(this.tasksStored));
  }

  onSubmit() {
    if (this.createBoardForm.invalid) {
      this.showError = true;
      setTimeout(() => {
        this.showError = false;
      }, 1500);
      return;
    }
    const { name, columns } = this.createBoardForm.value;

    let newColumns = [];
    const tasks: any = {};
    for (const key in columns) {
      newColumns.push(columns[key].column.toLowerCase());

      tasks[columns[key].column.toLowerCase()] = [];
    }

    const generatedId = this.taskService.generateRandomString();

    if (this.editState == true) {
      this.store.dispatch(
        fromBoardsHttpActions.updateBoard({
          board: {
            name: name,
            columns: newColumns,
            id: this.board?.id,
            tasks: { ...tasks, ...this.tasksStored },
          },
        })
      );

      this.isEditing$ = this.taskService.isSubmitting.subscribe((status) => {
        if (!status) {
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
    this.isEditing$.unsubscribe();
  }
}
