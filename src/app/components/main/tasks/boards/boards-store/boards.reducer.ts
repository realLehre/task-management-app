import { createReducer, createSelector, on } from '@ngrx/store';

import { Board } from 'src/app/shared/models/board.model';
import * as BoardsPageActions from './boards.actions';

const createBoard = (boards: Board[], board: Board) => [...boards, board];

const addColumn = (boards: Board[], toUpdateBoard: Board) => {
  const oldBoard = boards.find((board) => board.id == toUpdateBoard.id);

  const newBoard = {
    ...oldBoard,
    ...toUpdateBoard,
  };

  const i = boards.findIndex((board) => board.id == toUpdateBoard.id);

  const newBoards = [...boards];
  newBoards[i] = newBoard;

  return newBoards;
};

const updateBoard = (boards: Board[], boardToUpdate: Board) => {
  const oldBoard = boards.find((board) => board.id == boardToUpdate.id);

  const newBoard = {
    ...oldBoard,
    ...boardToUpdate,
  };

  const boardIndex = boards.findIndex((board) => board.id == boardToUpdate.id);

  const newBoards = [...boards];

  newBoards[boardIndex] = newBoard;

  return newBoards;
};

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
  on(BoardsPageActions.loadBoards, (state, action) => {
    return {
      ...state,
      boards: action.boards,
    };
  }),
  on(BoardsPageActions.createNewBoard, (state, action) => {
    return {
      ...state,
      activeBoard: null,
      boards: createBoard(state.boards, action.board),
    };
  }),

  on(BoardsPageActions.selectBoard, (state, action) => {
    return {
      ...state,
      activeBoard: action.id,
    };
  }),

  on(BoardsPageActions.updateBoardsSuccess, (state, action) => {
    return {
      ...state,
      boards: action.boards,
    };
  }),

  on(BoardsPageActions.deleteBoard, (state, action) => {
    return {
      ...state,
      boards: deleteBoard(state.boards, action.id),
      activeBoard: null,
    };
  })
);

export const selectBoards = (state: State) => state.boards;

export const selectActiveBoardId = (state: State) => state.activeBoard;

export const selectActiveBoard = createSelector(
  selectBoards,
  selectActiveBoardId,
  (boards, activeBoardId) => {
    if (boards.length > 0) {
      return boards.find((board) => board.id == activeBoardId);
    } else {
      return {
        name: '',
        columns: [],
        id: '',
        tasks: {},
      };
    }
  }
);
