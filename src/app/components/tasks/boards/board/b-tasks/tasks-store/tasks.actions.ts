import { createAction, props } from '@ngrx/store';
import { Task } from 'src/app/shared/models/task.model';

export const addTask = createAction(
  '[Task Page] Add Task',
  props<{ task: Task }>()
);

export const editTask = createAction(
  '[Task Page] Edit Task',
  props<{ id: string }>()
);

export const viewTask = createAction(
  '[Task Page] View Task',
  props<{ id: string }>()
);

export const deleteTask = createAction(
  '[Task Page] Delete Task',
  props<{ id: string }>()
);
