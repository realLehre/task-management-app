import { createAction, props } from '@ngrx/store';
import { Board } from 'src/app/shared/models/board.model';

export const createNewBoard = createAction(
  '[Boards Page] Create New Board',
  props<Board>()
);

export const selectBoard = createAction(
  '[Boards Page] Select Board',
  props<{ id: string }>()
);

export const viewBoard = createAction(
  '[Boards Page] View Board',
  props<{ id: string }>()
);

export const editBoard = createAction(
  '[Boards Page] Edit Board',
  props<{ board: Board }>()
);

export const updateBoard = createAction(
  '[Boards Page] New Column',
  props<{ board: Board }>()
);

export const deleteBoard = createAction(
  '[Boards Page] Delete Board',
  props<{ id: string }>()
);

export const showNoBoard = createAction('[Boards Page] Show No Board');
