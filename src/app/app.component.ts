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
  showFiller: boolean = false;
  @ViewChild('drawer', { static: false }) drawer!: MatDrawer;

  ngOnInit(): void {}

  ngAfterViewChecked(): void {
    // this.drawer.toggle();
  }

  ngAfterViewInit(): void {
    console.log(this.drawer);
    this.drawer.opened = true;
  }
}
