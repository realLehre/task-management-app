import {
  AfterViewChecked,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import { TaskService } from 'src/app/core/services/task.service';
import { BoardsDialogComponent } from './boards-dialog/boards-dialog.component';
import { ThemeService } from 'src/app/core/theme.service';
import * as fromStore from '@store';
import * as fromBoardsActions from '@boardsPageActions';
import { Board } from 'src/app/shared/models/board.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss'],
})
export class BoardsComponent implements OnInit, AfterViewChecked {
  @Output() showSideBar = new EventEmitter<boolean>();
  currentMode: string | null = 'light';
  isToggled: boolean = false;
  boards: Board[] = [];
  boardIdStored!: string;
  displayName!: string;

  constructor(
    private renderer: Renderer2,
    private taskService: TaskService,
    private dialog: MatDialog,
    private themeService: ThemeService,
    private store: Store<fromStore.State>,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const theme = localStorage.getItem('theme');
    if (theme) {
      theme == 'dark' ? (this.isToggled = true) : (this.isToggled = false);
    }

    this.store.select(fromStore.selectAllBoards).subscribe((data) => {
      this.boards = data;

      const boardId = localStorage.getItem('board_id');
      const boardName = localStorage.getItem('board_name');
      this.boardIdStored = boardId ?? this.boardIdStored;

      if (boardId) {
        // this.router.navigate(['boards'], {
        //   queryParams: { board: boardName, board_Id: boardId },
        // });
        this.store.dispatch(fromBoardsActions.selectBoard({ id: boardId }));
      }

      if (this.boards.length == 0) {
        localStorage.removeItem('board_id');
        localStorage.removeItem('board_name');
        this.router.navigate(['boards'], { fragment: 'add-board' });
      }
    });

    this.displayName = JSON.parse(
      localStorage.getItem('user')!
    ).user.displayName;
  }

  ngAfterViewChecked(): void {
    const boardId = localStorage.getItem('board_id');
    this.boardIdStored = boardId ?? this.boardIdStored;
  }

  hideSideBar() {
    this.showSideBar.emit(false);
  }

  onCreateNewBoard() {
    const dialogRef = this.dialog.open(BoardsDialogComponent, {
      panelClass: 'board_dialog',
      autoFocus: false,
      data: { mode: 'create', isAddColumn: false },
    });
  }

  onSelectBoard(id: string, name: string) {
    localStorage.setItem('board_id', id);
    localStorage.setItem('board_name', name);
    this.store.dispatch(fromBoardsActions.selectBoard({ id: id }));
  }

  toggleMode() {
    this.isToggled = !this.isToggled;
    this.themeService.toggleTheme();
  }

  onLogout() {}
}
