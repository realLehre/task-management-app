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
  themeState!: string | null;
  logoSrc!: string;

  constructor(private dialog: MatDialog, private taskService: TaskService) {}

  ngOnInit(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      height: '900px',
      width: '600px',
    });
  }

  ngAfterViewChecked(): void {
    // if (localStorage.getItem('theme') != null) {
    //   this.themeState = localStorage.getItem('theme');
    // } else {
    //   this.themeState = 'dark';
    // }
    // console.log(this.themeState);
  }

  openModal(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      height: '700px',
      width: '600px',
    });
  }
}
