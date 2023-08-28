import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Task } from 'src/app/shared/models/task.model';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';

@Component({
  selector: 'app-b-task',
  templateUrl: './b-task.component.html',
  styleUrls: ['./b-task.component.scss'],
})
export class BTaskComponent implements OnInit {
  @Input() tasks: Task[] = [];
  @Output() taskSelected = new EventEmitter<Task>();

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  onViewTask(task: Task) {
    this.taskSelected.emit(task);
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      height: '900px',
      width: '600px',
      data: { type: 'view_task', mode: { isEdit: false }, selectedTask: task },
    });
  }
}
