import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { TaskService } from 'src/app/core/services/task.service';
import { BoardsDialogComponent } from '../boards-dialog/boards-dialog.component';
import { ThemeService } from 'src/app/core/theme.service';
import * as fromStore from '@store';
import * as fromBoardsActions from '@boardsPageActions';
import * as fromAuthActions from '@authPageActions';
import { Board } from 'src/app/shared/models/board.model';

@Component({
  selector: 'app-mobile-boards',
  templateUrl: './mobile-boards.component.html',
  styleUrls: ['./mobile-boards.component.scss'],
})
export class MobileBoardsComponent implements OnInit {
  currentMode: string | null = 'light';
  isToggled: boolean = false;
  boards: Board[] = [];
  displayName!: string;
  boardIdStored!: string;

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private themeService: ThemeService,
    private store: Store<fromStore.State>,
    private router: Router,
    public dialogRef: MatDialogRef<MobileBoardsComponent>
  ) {}

  ngOnInit(): void {
    const theme = localStorage.getItem('theme');
    if (theme) {
      theme == 'dark' ? (this.isToggled = true) : (this.isToggled = false);
    }

    this.taskService.isLoadingBoards.subscribe((status) => {
      if (status == false) {
        this.store.select(fromStore.selectAllBoards).subscribe((data) => {
          this.boards = data;

          const boardId = localStorage.getItem('board_id');
          const boardName = localStorage.getItem('board_name');
          this.boardIdStored = boardId ?? this.boardIdStored;

          if (boardId) {
            this.selectBoard(boardId, boardName!);
          } else {
            this.selectBoard(data[0].id, data[0].name);
          }

          if (this.boards.length == 0) {
            localStorage.removeItem('board_id');
            localStorage.removeItem('board_name');
            this.router.navigate(['boards'], { fragment: 'add-board' });
          }
        });
      }
    });
    this.dialogRef.afterClosed().subscribe((data) => {
      this.taskService.isBoardMenuOpened.next(false);
    });

    this.displayName = JSON.parse(
      localStorage.getItem('kanbanUser')!
    ).displayName;
  }

  ngAfterViewChecked(): void {
    const boardId = localStorage.getItem('board_id');
    this.boardIdStored = boardId ?? this.boardIdStored;
  }

  onCreateNewBoard() {
    const dialogRef = this.dialog.open(BoardsDialogComponent, {
      panelClass: 'board_dialog',
      data: { mode: 'create', isAddColumn: false },
    });
    this.dialogRef.close();
  }

  selectBoard(id: string, name: string) {
    localStorage.setItem('board_id', id);
    localStorage.setItem('board_name', name);
    this.router.navigate(['boards'], {
      queryParams: { board: name, board_Id: id },
    });
    this.store.dispatch(fromBoardsActions.selectBoard({ id: id }));
  }

  onSelectBoard(id: string, name: string) {
    localStorage.setItem('board_id', id);
    localStorage.setItem('board_name', name);
    this.router.navigate(['boards'], {
      queryParams: { board: name, board_Id: id },
    });
    this.store.dispatch(fromBoardsActions.selectBoard({ id: id }));
    this.dialog.closeAll();
  }

  toggleMode() {
    this.isToggled = !this.isToggled;
    this.themeService.toggleTheme();
  }

  onLogout() {
    this.store.dispatch(fromAuthActions.Logout());
    this.dialog.closeAll();
  }
}
