import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from 'src/app/shared/services/task.service';
import { BoardsDialogComponent } from './boards-dialog/boards-dialog.component';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss'],
})
export class BoardsComponent implements OnInit {
  @Output() showSideBar = new EventEmitter<boolean>();
  currentMode: string | null = 'light';
  isToggled: boolean = false;

  constructor(
    private renderer: Renderer2,
    private taskService: TaskService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('theme') != null) {
      this.currentMode = localStorage.getItem('theme')
        ? localStorage.getItem('theme')
        : null;
      this.saveTheme();
    }
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

  toggleMode() {
    this.isToggled = !this.isToggled;

    if (this.currentMode == 'light') {
      this.renderer.addClass(document.body, 'dark');
      this.currentMode = 'dark';
      localStorage.setItem('theme', this.currentMode);
    } else {
      this.renderer.removeClass(document.body, 'dark');
      this.currentMode = 'light';
      localStorage.setItem('theme', this.currentMode);
    }

    this.taskService.themeState.next(this.currentMode);
  }

  saveTheme() {
    if (this.currentMode == 'dark') {
      this.renderer.addClass(document.body, 'dark');
      this.isToggled = true;
    } else {
      this.renderer.removeClass(document.body, 'dark');
      this.isToggled = false;
    }
  }
}
