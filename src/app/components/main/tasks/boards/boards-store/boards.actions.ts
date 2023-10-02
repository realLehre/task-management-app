import { createAction, props } from '@ngrx/store';
import { Board } from 'src/app/shared/models/board.model';

export const getAllBoards = createAction('[Boards HTTP] Get All Boards');

export const loadBoards = createAction(
  '[Boards Page] Load Boards',
  props<{ boards: Board[] }>()
);

export const createNewBoard = createAction(
  '[Boards Page] Create New Board',
  props<{ board: Board }>()
);

export const selectBoard = createAction(
  '[Boards Page] Select Board',
  props<{ id: string }>()
);

export const updateBoardsSuccess = createAction(
  '[Boards Page] Update Success',
  props<{ boards: Board[] }>()
);

export const deleteBoard = createAction(
  '[Boards Page] Delete Board',
  props<{ id: string }>()
);
