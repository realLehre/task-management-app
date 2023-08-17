import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer, MatDrawerToggleResult } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  showFiller: boolean = false;
  @ViewChild('drawer') drawer!: MatDrawer;

  ngOnInit(): void {
    this.drawer.toggle;
  }
}
