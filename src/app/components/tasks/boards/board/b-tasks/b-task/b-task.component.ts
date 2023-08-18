import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-b-task',
  templateUrl: './b-task.component.html',
  styleUrls: ['./b-task.component.scss'],
})
export class BTaskComponent implements OnInit {
  test = 5;
  constructor() {}

  ngOnInit(): void {}
}
