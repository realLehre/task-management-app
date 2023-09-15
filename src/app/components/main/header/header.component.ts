import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import { TaskDialogComponent } from '../../main/tasks/boards/board/b-tasks/task-dialog/task-dialog.component';
import { BoardsDialogComponent } from '../../main/tasks/boards/boards-dialog/boards-dialog.component';
import { TaskService } from 'src/app/core/services/task.service';
import { ThemeService } from 'src/app/core/theme.service';
import * as fromStore from '@store';
import * as fromBoardsActions from '@boardsPageActions';
import { MobileBoardsComponent } from '../../main/tasks/boards/mobile-boards/mobile-boards.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewChecked {
  themeState: string | null = 'light';
  logoSrc!: string;
  boardName: string | undefined;
  mobileBoardName: string | undefined;
  isDrawerOpened: boolean = false;
  isAngleUp: boolean = false;

  constructor(
    private dialog: MatDialog,
    private taskService: TaskService,
    private themeService: ThemeService,
    private store: Store<fromStore.State>
  ) {}

  ngOnInit(): void {
    this.themeService.themeState.subscribe((value) => {
      if (value) {
        this.themeState = value;
      }
    });

    this.store.select(fromStore.selectActiveBoard).subscribe((board) => {
      this.boardName = board?.name != '' ? board?.name : 'Add board';
      this.mobileBoardName =
        board?.name != '' ? board?.name : 'Click to add board';
    });

    this.taskService.isDrawerOpened.subscribe(
      (data) => (this.isDrawerOpened = data)
    );

    this.taskService.isBoardMenuOpened.subscribe(
      (status) => (this.isAngleUp = status)
    );
  }

  ngAfterViewChecked(): void {}

  onEditBoard_Task(type: string) {
    switch (type) {
      case 'edit_board':
        this.openModal(BoardsDialogComponent, 'create', true);
        break;
      case 'add_board':
        this.openModal(BoardsDialogComponent, 'create', false);
        break;
      case 'delete_board':
        this.openModal(BoardsDialogComponent, 'delete', false);
        break;
      case 'add_task':
        const dialogRef = this.dialog.open(TaskDialogComponent, {
          panelClass: 'add_view_task_dialog',
          autoFocus: false,
          data: { type: 'add_task', mode: { isEdit: false } },
        });
    }
  }

  openModal(component: any, mode: string, isAddColumn?: boolean) {
    const dialogRef = this.dialog.open(BoardsDialogComponent, {
      panelClass: 'board_dialog',
      autoFocus: false,
      data: { mode: mode, isAddColumn: isAddColumn },
    });
  }

  onOpenMobileMenu() {
    this.isAngleUp = !this.isAngleUp;

    const dialogRef = this.dialog.open(MobileBoardsComponent, {
      panelClass: 'mobile_board_dialog',
      position: { top: '100px' },
      autoFocus: false,
    });
  }
}
