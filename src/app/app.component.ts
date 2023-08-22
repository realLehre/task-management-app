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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewChecked, AfterViewInit {
  isShowSideNav: boolean = false;
  @ViewChild('drawer', { static: false }) drawer!: MatDrawer;

  constructor() {}

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
