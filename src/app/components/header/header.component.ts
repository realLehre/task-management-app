import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import { TaskDialogComponent } from '../tasks/boards/board/b-tasks/task-dialog/task-dialog.component';
import { BoardsDialogComponent } from '../tasks/boards/boards-dialog/boards-dialog.component';
import { TaskService } from 'src/app/core/services/task.service';
import { ThemeService } from 'src/app/core/theme.service';
import * as fromStore from '@store';
import * as fromBoardsActions from '@boardsPageActions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewChecked {
  themeState: string | null = 'light';
  logoSrc!: string;
  boardName!: string;
  isDrawerOpened: boolean = false;

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
      this.boardName = board?.name ?? this.boardName;
    });

    this.taskService.isDrawerOpened.subscribe(
      (data) => (this.isDrawerOpened = data)
    );
  }

  ngAfterViewChecked(): void {}

  onEditBoard_Task(type: string) {
    switch (type) {
      case 'board':
        this.openModal(BoardsDialogComponent, 'create', true);
        break;
      case 'delete_board':
        this.openModal(BoardsDialogComponent, 'delete', false);
        break;
      case 'add_task':
        const dialogRef = this.dialog.open(TaskDialogComponent, {
          panelClass: 'add_view_task_dialog',
          data: { type: 'add_task', mode: { isEdit: false } },
        });
    }
  }

  openModal(component: any, mode: string, isAddColumn?: boolean) {
    const dialogRef = this.dialog.open(BoardsDialogComponent, {
      panelClass: 'board_dialog',
      data: { mode: mode, isAddColumn: isAddColumn },
    });
  }
}
