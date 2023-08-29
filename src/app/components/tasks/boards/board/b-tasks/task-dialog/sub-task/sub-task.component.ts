import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sub-task',
  templateUrl: './sub-task.component.html',
  styleUrls: ['./sub-task.component.scss'],
})
export class SubTaskComponent implements OnInit {
  @Input() subtasks!: string[];
  checked: boolean = false;
  test: string[] = ['test1'];
  constructor() {}

  ngOnInit(): void {
    if (this.test.find((t) => t == 'test1')) {
      this.checked = true;
    }
  }

  toggleCheck(subtask: string) {
    this.test.push(subtask);
    if (this.test.find((sub) => sub == subtask)) {
      this.checked = !this.checked;
    }
  }
}
