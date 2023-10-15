import { createAction, props } from '@ngrx/store';
import { Board } from 'src/app/shared/models/board.model';

export const boardsPageLoaded = createAction(
  '[Boards Http] Boards Page Loaded'
);

export const getAllBoards = createAction(
  '[Boards HTTP] Get All Boards',
  props<{ boards: Board[] }>()
);

export const boardsLoadedSuccess = createAction(
  '[Boards HTTP] Boards Loaded Success',
  props<{ boards: Board[] }>()
);

export const createBoard = createAction(
  '[Boards HTTP] Create Board',
  props<{ board: Board }>()
);

export const createBoardSuccess = createAction(
  '[Boards HTTP] Create Board Success',
  props<{ board: Board }>()
);

export const updateBoard = createAction(
  '[Boards HTTP] Update Boards',
  props<{ board: Board }>()
);

export const deleteBoard = createAction(
  '[Boards HTTP] Delete Board',
  props<{ id: string }>()
);
