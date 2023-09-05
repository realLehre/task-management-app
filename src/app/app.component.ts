import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MatDrawer, MatDrawerToggleResult } from '@angular/material/sidenav';
import { ThemeService } from './core/theme.service';
import { TaskService } from './core/services/task.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewChecked, AfterViewInit {
  isShowSideNav!: boolean;
  sideNavOpened: boolean = true;
  @ViewChild('drawer', { static: false }) drawer!: MatDrawer;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    const sideNavStatus = JSON.parse(
      localStorage.getItem('sideNavOpened') || ''
    );
    if (sideNavStatus != undefined) {
      this.sideNavOpened = sideNavStatus;
    }
    this.isShowSideNav = this.sideNavOpened;
  }

  ngAfterViewChecked(): void {}

  ngAfterViewInit(): void {
    this.drawer.opened = true;
    this.taskService.isDrawerOpened.next(this.drawer.opened);
  }

  toggleSideNav() {
    this.isShowSideNav = !this.isShowSideNav;

    this.drawer.opened = !this.drawer.opened;
    this.taskService.isDrawerOpened.next(this.drawer.opened);
    localStorage.setItem('sideNavOpened', JSON.stringify(this.isShowSideNav));
  }
}
