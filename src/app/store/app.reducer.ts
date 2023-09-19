import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';

import * as fromBoards from '../components/main/tasks/boards/boards-store/boards.reducer';
import * as fromTasks from '../components/main/tasks/boards/board/b-tasks/tasks-store/tasks.reducer';
import * as fromAuth from '../components/auth/auth-store/auth.reducer';

export interface State {
  boards: fromBoards.State;
  tasks: fromTasks.TaskState;
  auth: fromAuth.AuthState;
}

export const appReducer: ActionReducerMap<State> = {
  boards: fromBoards.boardsReducer,
  tasks: fromTasks.tasksReducer,
  auth: fromAuth.authReducer,
};

export const getBoardsState = createFeatureSelector<fromBoards.State>('boards');

export const selectAllBoards = createSelector(
  getBoardsState,
  fromBoards.selectBoards
);

export const selectActiveBoard = createSelector(
  getBoardsState,
  fromBoards.selectActiveBoard
);

export const selectActiveBoardId = createSelector(
  getBoardsState,
  fromBoards.selectActiveBoardId
);

// export const getTaskState = createFeatureSelector<fromTasks.TaskState>('tasks');

// export const selectAllTasks = createSelector(
//   getTaskState,
//   fromTasks.selectTasks
// );

// export const selectActiveTaskId = createSelector(
//   getTaskState,
//   fromTasks.selectActiveTaskId
// );

// export const selectActiveTask = createSelector(
//   getTaskState,
//   fromTasks.selectActiveTask
// );

export const getUser = createFeatureSelector<fromAuth.AuthState>('auth');

export const user = createSelector(getUser, fromAuth.getUser);

export const authState = createSelector(
  getUser,
  fromAuth.getAuthenticationState
);

export const getErrorMessage = createSelector(
  getUser,
  fromAuth.getErrorMessage
);
