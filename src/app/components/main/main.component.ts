import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { TaskService } from 'src/app/core/services/task.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, AfterViewInit {
  isShowSideNav!: boolean;
  sideNavOpened: boolean = true;
  @ViewChild('drawer', { static: false }) drawer!: MatDrawer;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {}

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
