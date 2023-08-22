import {
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

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss'],
})
export class BoardsComponent implements OnInit {
  @Output() showSideBar = new EventEmitter<boolean>();
  currentMode: string | null = 'light';
  isToggled: boolean = false;
  boards: Board[] = [];

  constructor(
    private renderer: Renderer2,
    private taskService: TaskService,
    private dialog: MatDialog,
    private themeService: ThemeService,
    private store: Store<fromStore.State>
  ) {}

  ngOnInit(): void {
    const theme = localStorage.getItem('theme');
    if (theme) {
      theme == 'dark' ? (this.isToggled = true) : (this.isToggled = false);
    }

    this.store.select(fromStore.selectAllBoards).subscribe((data) => {
      this.boards = data;
    });
  }

  hideSideBar() {
    this.showSideBar.emit(false);
  }

  onCreateNewBoard() {
    const dialogRef = this.dialog.open(BoardsDialogComponent, {
      height: '900px',
      width: '600px',
      data: 'create',
    });
  }

  onSelectBoard(id: string) {
    console.log(id);
    this.store.dispatch(fromBoardsActions.selectBoard({ id: id }));
  }

  toggleMode() {
    this.isToggled = !this.isToggled;
    this.themeService.toggleTheme();
  }
}
