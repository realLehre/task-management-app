import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { TaskDialogComponent } from '../tasks/boards/board/b-tasks/task-dialog/task-dialog.component';
import { BoardsDialogComponent } from '../tasks/boards/boards-dialog/boards-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      height: '900px',
      width: '600px',
    });
  }

  openModal(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      height: '700px',
      width: '600px',
    });
  }
}
