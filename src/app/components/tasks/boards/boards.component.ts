import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from 'src/app/core/services/task.service';
import { BoardsDialogComponent } from './boards-dialog/boards-dialog.component';
import { ThemeService } from 'src/app/core/theme.service';

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
    private dialog: MatDialog,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    const theme = localStorage.getItem('theme');
    if (theme) {
      theme == 'dark' ? (this.isToggled = true) : (this.isToggled = false);
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
    this.themeService.toggleTheme();
  }
}
