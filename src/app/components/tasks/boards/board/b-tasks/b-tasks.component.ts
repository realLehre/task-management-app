import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import * as fromStore from '@store';
import { switchMap } from 'rxjs';
import { Board } from 'src/app/shared/models/board.model';
import { BoardsDialogComponent } from '../../boards-dialog/boards-dialog.component';

@Component({
  selector: 'app-b-tasks',
  templateUrl: './b-tasks.component.html',
  styleUrls: ['./b-tasks.component.scss'],
})
export class BTasksComponent implements OnInit {
  test: any = 6;
  activeBoard: Board = {
    name: '',
    columns: [],
    id: '',
    tasks: [],
  };
  showTasks: boolean = false;

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.store.select(fromStore.selectActiveBoard).subscribe((board) => {
      this.activeBoard = board ?? this.activeBoard;
      console.log(this.activeBoard);
    });
  }

  onAddBoard_Column(type: string) {
    if (type == 'column') {
      this.openModal(true);
    } else if (type == 'board') {
      this.openModal(false);
    }
  }

  openModal(isAddColuimn: boolean) {
    const dialogRef = this.dialog.open(BoardsDialogComponent, {
      height: '900px',
      width: '600px',
      data: { mode: 'create', isAddColumn: isAddColuimn },
    });
  }
}
