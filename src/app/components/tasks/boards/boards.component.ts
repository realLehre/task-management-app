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
}
