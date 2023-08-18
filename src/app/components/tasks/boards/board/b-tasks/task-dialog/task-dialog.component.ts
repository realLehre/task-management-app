import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss'],
})
export class TaskDialogComponent implements OnInit {
  t = 6;
  constructor() {}

  ngOnInit(): void {}
}
