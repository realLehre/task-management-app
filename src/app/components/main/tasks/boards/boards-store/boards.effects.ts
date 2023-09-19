import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as fromBoardsHttpActions from '@boardsHttpActions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { TaskService } from 'src/app/core/services/task.service';
import { of } from 'rxjs';

export class BoardsEffects {
  constructor(private actions: Actions, private taskService: TaskService) {}

  loadAllBoards$ = createEffect(() =>
    this.actions.pipe(
      ofType(fromBoardsHttpActions.boardsPageLoaded),
      mergeMap(() => {
        return this.taskService.getBoards().pipe(
          map((data) =>
            fromBoardsHttpActions.getAllBoards({
              boards: data.data()?.boards!,
            })
          ),
          catchError((err) => {
            console.log(err);
            return of();
          })
        );
      })
    )
  );
}
