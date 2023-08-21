import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';

import { Board } from 'src/app/core/models/board.model';
import { Boards } from 'src/app/core/models/boards.model';
import * as BoardsPageActions from './boards.actions';

const createBoard = (boards: Board[], board: Board) => [...boards, board];

// const viewBoard = (boards: Board[], id: number) => {
//      boards.map((board, index) => {
//         return index == id
//     })
// }

const editBoard = (boards: Board[], edit: Board) =>
  boards.find((board) => board.id === edit.id);

const deleteBoard = (boards: Board[], boardId: string) =>
  boards.filter((board) => board.id != boardId);

export interface State {
  boards: Board[];
  activeBoard: string | null;
}

export const initialState: State = {
  boards: [],
  activeBoard: null,
};

export const boardsReducer = createReducer(
  initialState,
  on(BoardsPageActions.createNewBoard, (state, action) => {
    return {
      ...state,
      activeBoard: null,
      boards: createBoard(state.boards, action),
    };
  }),

  on(BoardsPageActions.selectBoard, (state, action) => {
    return {
      ...state,
      activeBoard: action.id,
    };
  }),

  on(BoardsPageActions.viewBoard, (state, action) => {
    return {
      ...state,
      activeBoard: action.id,
    };
  }),

  on(BoardsPageActions.editBoard, (state, action) => {
    return {
      ...state,
      boards: [...state.boards, action.board],
    };
  }),

  on(BoardsPageActions.deleteBoard, (state, action) => {
    return {
      ...state,
      boards: deleteBoard(state.boards, action.id),
    };
  })
);

export const selectBoards = (state: State) => state.boards;

export const selectActiveBoardId = (state: State) => state.activeBoard;

export const selectActiveBoard = createSelector(
  selectBoards,
  selectActiveBoardId,
  (boards, activeBoardId) => {
    return boards.find((board) => board.id == activeBoardId);
  }
);
