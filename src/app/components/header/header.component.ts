import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { TaskDialogComponent } from '../tasks/boards/board/b-tasks/task-dialog/task-dialog.component';
import { BoardsDialogComponent } from '../tasks/boards/boards-dialog/boards-dialog.component';
import { TaskService } from 'src/app/shared/services/task.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewChecked {
  themeState: string | null = 'light';
  logoSrc!: string;

  constructor(private dialog: MatDialog, private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.themeState.subscribe((value) => {
      if (value) {
        this.themeState = value;
      }
    });
  }

  ngAfterViewChecked(): void {}

  openModal(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      height: '700px',
      width: '600px',
    });
  }
}
