import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss'],
})
export class BoardsComponent implements OnInit {
  @Output() showSideBar = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {}

  hideSideBar() {
    this.showSideBar.emit(false);
  }

  toggleMode() {
    const body = document.getElementsByTagName('body')[0];

    // body.classList.toggle(Mode.LIGHT);
    // body.classList.toggle(Mode.DARK);
    // if (this.currentMode === Mode.LIGHT) {
    //   this.updateCurrentMode(Mode.DARK);
    // } else {
    //   this.updateCurrentMode(Mode.LIGHT);
    // }
  }
}
