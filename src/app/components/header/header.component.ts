import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { TaskDialogComponent } from '../tasks/boards/board/b-tasks/task-dialog/task-dialog.component';
import { BoardsDialogComponent } from '../tasks/boards/boards-dialog/boards-dialog.component';
import { TaskService } from 'src/app/core/services/task.service';
import { ThemeService } from 'src/app/core/theme.service';
import * as fromStore from '@store';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewChecked {
  themeState: string | null = 'light';
  logoSrc!: string;
  boardName!: string;

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

    this.store
      .select(fromStore.selectActiveBoard)
      .subscribe((board) => (this.boardName = board?.name ?? this.boardName));
  }

  ngAfterViewChecked(): void {}

  openModal(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      height: '700px',
      width: '600px',
    });
  }
}
