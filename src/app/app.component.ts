import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDrawer, MatDrawerToggleResult } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewChecked, AfterViewInit {
  isShowSideNav: boolean = false;
  @ViewChild('drawer', { static: false }) drawer!: MatDrawer;

  ngOnInit(): void {}

  ngAfterViewChecked(): void {}

  ngAfterViewInit(): void {
    this.drawer.opened = true;
  }

  toggleSideNav() {
    this.isShowSideNav = !this.isShowSideNav;
    this.drawer.opened = !this.drawer.opened;
  }
}
