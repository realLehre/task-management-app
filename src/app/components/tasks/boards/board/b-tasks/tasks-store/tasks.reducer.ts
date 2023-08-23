import { createReducer, createSelector, on } from '@ngrx/store';

import { Task } from 'src/app/shared/models/task.model';
import * as fromTasksActions from '@tasksPageActions';

export interface TaskState {
  tasks: Task[];
  activeTaskId: string | null;
}

const initialState: TaskState = {
  tasks: [],
  activeTaskId: null,
};

export const tasksReducer = createReducer(
  initialState,
  on(fromTasksActions.addTask, (state, action) => {
    return {
      ...state,
      tasks: [...state.tasks, action.task],
    };
  }),

  on(fromTasksActions.viewTask, (state, action) => {
    return {
      ...state,
      activeTaskId: action.id,
    };
  }),

  on(fromTasksActions.editTask, (state, action) => {
    return {
      ...state,
      activeTaskId: action.id,
    };
  }),

  on(fromTasksActions.deleteTask, (state, action) => {
    return {
      ...state,
      activeTaskId: action.id,
    };
  })
);

export const selectTasks = (state: TaskState) => state.tasks;

export const selectActiveTaskId = (state: TaskState) => state.activeTaskId;

export const selectActiveTask = createSelector(
  selectTasks,
  selectActiveTaskId,
  (tasks, id) => {
    tasks.find((task) => task.id == id);
  }
);
