import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-b-tasks',
  templateUrl: './b-tasks.component.html',
  styleUrls: ['./b-tasks.component.scss'],
})
export class BTasksComponent implements OnInit {
  test: any = 6;

  constructor() {}

  ngOnInit(): void {}
}
