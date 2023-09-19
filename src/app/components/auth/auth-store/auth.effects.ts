import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, take, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { AuthService } from 'src/app/core/services/auth-service/auth.service';
import * as fromAuthActions from '@authPageActions';
import * as fromBoardsHttpActions from '@boardsHttpActions';
import { UserCredential } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { TaskService } from 'src/app/core/services/task.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  constructor(
    private actions: Actions,
    private authService: AuthService,
    private taskService: TaskService,
    private router: Router
  ) {}

  login$ = createEffect(() =>
    this.actions.pipe(
      ofType(fromAuthActions.SignUp),
      concatMap((action) => {
        return this.authService.signUp(action.email, action.password).pipe(
          tap((res) => {
            this.taskService.setUserData(res);
          }),
          map((res) => {
            return fromAuthActions.SignUpSuccess({ user: res });
          }),
          catchError((err) => {
            console.log(err);
            return of(
              fromAuthActions.SignUpFailure({
                errorMessage: this.getErrorMessage(err.code),
              })
            );
          })
        );
      })
    )
  );

  googleAuth$ = createEffect(() =>
    this.actions.pipe(
      ofType(fromAuthActions.googleAuth),
      concatMap(() => {
        return this.authService.signInWithGoogle().pipe(
          tap((res) => {
            this.taskService.setUserData(res);
          }),
          map((res) => {
            return fromAuthActions.SignUpSuccess({ user: res });
          }),
          catchError((err) => {
            console.log(err);
            return of(
              fromAuthActions.SignUpFailure({
                errorMessage: this.getErrorMessage(err.code),
              })
            );
          })
        );
      })
    )
  );

  signUpSuccess$ = createEffect(() =>
    this.actions.pipe(
      ofType(fromAuthActions.SignUpSuccess),
      take(1),
      tap((res) => {
        localStorage.setItem('user', JSON.stringify(res.user));
        this.router.navigate(['/', 'boards']);
        console.log(res.user);
      }),
      map((res) => fromBoardsHttpActions.boardsPageLoaded())
    )
  );

  getErrorMessage(err: any) {
    switch (err) {
      case 'auth/email-already-in-use': {
        return 'Email already in use';
      }
      case 'auth/wrong-password': {
        return 'Password is incorrect';
      }
      case 'auth/user-not-found': {
        return 'User not found';
      }
      default: {
        return 'An error occured, try again later';
      }
    }
  }
}
