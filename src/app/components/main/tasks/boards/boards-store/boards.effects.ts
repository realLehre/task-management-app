import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  concatMap,
  map,
  mergeMap,
  take,
  tap,
} from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { from, of } from 'rxjs';

import * as fromBoardsHttpActions from '@boardsHttpActions';
import { TaskService } from 'src/app/core/services/task.service';
import { User } from 'src/app/shared/models/user.model';
import * as fromBoardsActions from '@boardsPageActions';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BoardsEffects {
  usersDatabase: AngularFirestoreCollection<User>;
  constructor(
    private actions: Actions,
    private taskService: TaskService,
    private db: AngularFirestore
  ) {
    this.usersDatabase = this.db.collection('users');
  }

  loadAllBoards$ = createEffect(() =>
    this.actions.pipe(
      ofType(fromBoardsHttpActions.boardsPageLoaded),
      mergeMap(() => {
        this.taskService.isLoadingBoards.next(true);
        return this.taskService.getBoards().pipe(
          map((data) => {
            return fromBoardsActions.loadBoards({ boards: data ? data : [] });
          }),

          catchError((err) => {
            console.log(err);
            return of();
          })
        );
      })
    )
  );

  createBoard$ = createEffect(() =>
    this.actions.pipe(
      ofType(fromBoardsHttpActions.createBoard),
      concatMap((board) => {
        this.taskService.isSubmitting.next(true);
        return this.taskService.createBoard(board.board).pipe(
          map((data) => {
            return fromBoardsActions.createNewBoard({ board: data });
          }),
          catchError((err) => {
            console.log(err);
            return of();
          })
        );
      })
    )
  );

  updateBoards$ = createEffect(() =>
    this.actions.pipe(
      ofType(fromBoardsHttpActions.updateBoard),
      concatMap((data) => {
        this.taskService.isSubmitting.next(true);
        return this.taskService.updateBoards(data.board).pipe(
          map((data) => {
            return fromBoardsActions.updateBoardsSuccess({ boards: data });
          })
        );
      })
    )
  );

  deleteBoard$ = createEffect(() =>
    this.actions.pipe(
      ofType(fromBoardsHttpActions.deleteBoard),
      concatMap((data) => {
        this.taskService.isSubmitting.next(true);
        return this.taskService.deleteBoard(data.id).pipe(
          map((data) => {
            return fromBoardsActions.updateBoardsSuccess({ boards: data });
          })
        );
      })
    )
  );

  loadSuccess$ = createEffect(
    () =>
      this.actions.pipe(
        ofType(fromBoardsActions.loadBoards),
        tap((data) => {
          this.taskService.isLoadingBoards.next(false);
        })
      ),
    { dispatch: false }
  );

  createNewBoardSuccess$ = createEffect(
    () =>
      this.actions.pipe(
        ofType(fromBoardsActions.createNewBoard),
        tap((data) => {
          this.taskService.isSubmitting.next(false);
        })
      ),
    { dispatch: false }
  );

  updateBoardsSuccess$ = createEffect(
    () =>
      this.actions.pipe(
        ofType(fromBoardsActions.updateBoardsSuccess),
        tap((data) => {
          this.taskService.isSubmitting.next(false);
        })
      ),
    { dispatch: false }
  );
}
