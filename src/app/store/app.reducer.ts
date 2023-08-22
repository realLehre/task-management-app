import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import * as fromBoards from '../components/tasks/boards/boards-store/boards.reducer';

export interface State {
  boards: fromBoards.State;
}

export const appReducer: ActionReducerMap<State> = {
  boards: fromBoards.boardsReducer,
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
