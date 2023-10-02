import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { TaskService } from './core/services/task.service';

import * as fromStore from '@store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isShowSideNav!: boolean;
  sideNavOpened: boolean = true;
  @ViewChild('drawer', { static: false }) drawer!: MatDrawer;

  constructor(
    private taskService: TaskService,
    private store: Store<fromStore.State>
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('sideNavOpened')) {
      const sideNavStatus = JSON.parse(
        localStorage.getItem('sideNavOpened') || ''
      );
      if (sideNavStatus != undefined) {
        this.sideNavOpened = sideNavStatus;
      }
      this.isShowSideNav = this.sideNavOpened;
    }

    this.store.select(fromStore.getBoardsState).subscribe((data) => {
      // console.log(data);
    });
  }

  toggleSideNav() {
    this.isShowSideNav = !this.isShowSideNav;

    this.drawer.opened = !this.drawer.opened;
    this.taskService.isDrawerOpened.next(this.drawer.opened);
    localStorage.setItem('sideNavOpened', JSON.stringify(this.isShowSideNav));
  }
}
