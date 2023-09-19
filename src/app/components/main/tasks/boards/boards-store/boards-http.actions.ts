import { createAction, props } from '@ngrx/store';
import { Board } from 'src/app/shared/models/board.model';

export const boardsPageLoaded = createAction(
  '[Boards Http] Boards Page Loaded'
);

export const getAllBoards = createAction(
  '[Boards HTTP] Get All Boards',
  props<{ boards: Board[] }>()
);

export const updateBoards = createAction(
  '[Boards HTTP] Update Boards',
  props<{ boards: Board[] }>()
);
