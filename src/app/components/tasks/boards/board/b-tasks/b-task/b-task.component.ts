import { Component, Input, OnInit } from '@angular/core';
import { Task } from 'src/app/shared/models/task.model';

@Component({
  selector: 'app-b-task',
  templateUrl: './b-task.component.html',
  styleUrls: ['./b-task.component.scss'],
})
export class BTaskComponent implements OnInit {
  @Input() tasks: Task[] = [];

  constructor() {}

  ngOnInit(): void {}
}
