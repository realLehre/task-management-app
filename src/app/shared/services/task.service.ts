import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  themeState = new BehaviorSubject<string | null>(
    localStorage.getItem('theme')
  );

  constructor() {
    const theme = localStorage.getItem('theme');
    if (theme) {
      this.themeState.next(theme);
    }
  }
}
