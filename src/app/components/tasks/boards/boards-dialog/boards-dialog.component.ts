import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import * as fromStore from 'src/app/store/app.reducer';
import * as fromBoardsActions from '@boardsPageActions';
import { TaskService } from 'src/app/core/services/task.service';
import { Board } from 'src/app/shared/models/board.model';
import { ActivatedRoute, Router } from '@angular/router';

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
  board!: any;
  editState: boolean = false;
  boardId!: string;
  tasksStored!: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
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
        fromBoardsActions.updateBoard({
          board: {
            name: name,
            columns: newColumns,
            id: this.board?.id,
            tasks: { ...tasks, ...this.tasksStored },
          },
        })
      );

      localStorage.setItem('board_id', this.board.id);
      localStorage.setItem('board_name', this.board.name);
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { board: this.board.name, board_Id: this.board.id },
      });
    } else {
      this.store.dispatch(
        fromBoardsActions.createNewBoard({
          name: name,
          columns: newColumns,
          id: generatedId,
          tasks: { ...tasks },
        })
      );

      localStorage.setItem('board_name', name);

      localStorage.setItem('board_id', generatedId);
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { board: name, board_Id: generatedId },
      });
      this.store.dispatch(fromBoardsActions.selectBoard({ id: generatedId }));
    }

    this.dialog.closeAll();
  }

  onDeleteBoard() {
    this.store.dispatch(fromBoardsActions.deleteBoard({ id: this.boardId }));

    this.store.select(fromStore.selectAllBoards).subscribe((boards) => {
      this.store.dispatch(fromBoardsActions.selectBoard({ id: boards[0].id }));

      this.router.navigate(['tasks', boards[0].id]);

      localStorage.setItem('board_id', boards[0].id);
    });

    this.dialog.closeAll();
  }

  onCloseDialog() {
    this.dialog.closeAll();
  }
}
