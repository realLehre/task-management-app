import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  concatMap,
  map,
  mergeMap,
  take,
  tap,
} from 'rxjs/operators';
import { of } from 'rxjs';
import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  updateProfile,
} from '@angular/fire/auth';

import { AuthService } from 'src/app/core/services/auth-service/auth.service';
import * as fromAuthActions from '@authPageActions';
import * as fromBoardsHttpActions from '@boardsHttpActions';
import * as fromStore from '@store';
import { UserCredential } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { TaskService } from 'src/app/core/services/task.service';
import { Router } from '@angular/router';
import { AuthUser } from 'src/app/shared/models/user.model';
import { Store } from '@ngrx/store';

@Injectable()
export class AuthEffects {
  constructor(
    private actions: Actions,
    private authService: AuthService,
    private taskService: TaskService,
    private router: Router,
    private auth: Auth,
    private store: Store<fromStore.State>
  ) {}

  login$ = createEffect(() =>
    this.actions.pipe(
      ofType(fromAuthActions.Login),
      concatMap((action) => {
        this.authService.isAuthLoading.next(true);
        return this.authService.login(action.email, action.password).pipe(
          tap((res) => {
            this.taskService.setUserData(res);
          }),
          map((res) => {
            const user: AuthUser = this.getUserDetails(res);
            return fromAuthActions.LoginSuccess({ user: user });
          }),
          catchError((err) => {
            console.log(err);
            this.authService.errorMessage.next({
              errorMessage: this.getErrorMessage(err.code),
            });
            return of(
              fromAuthActions.LoginFailure({
                errorMessage: this.getErrorMessage(err.code),
              })
            );
          })
        );
      })
    )
  );

  signUp$ = createEffect(() =>
    this.actions.pipe(
      ofType(fromAuthActions.SignUp),
      concatMap((action) => {
        this.authService.isAuthLoading.next(true);

        return this.authService
          .signUp(action.name, action.email, action.password)
          .pipe(
            tap((res) => {
              this.taskService.setUserData(res);
            }),
            map((res) => {
              const currentUser = this.auth.currentUser;
              if (currentUser !== null) {
                updateProfile(currentUser, {
                  displayName: action.name,
                }).then((res) => console.log(res));
              }

              const user: AuthUser = this.getUserDetails(res);

              return fromAuthActions.SignUpSuccess({
                user: { ...user, displayName: action.name },
              });
            }),
            catchError((err) => {
              console.log(err);
              this.authService.errorMessage.next({
                errorMessage: this.getErrorMessage(err.code),
              });
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
            const user: AuthUser = this.getUserDetails(res);

            return fromAuthActions.SignUpSuccess({ user: user });
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

  signUpSuccess$ = createEffect(
    () =>
      this.actions.pipe(
        ofType(fromAuthActions.SignUpSuccess),
        tap((res) => {
          this.authService.isAuthLoading.next(false);

          localStorage.setItem('kanbanUser', JSON.stringify(res.user));
          this.router.navigate(['/', 'boards']);
          console.log(res.user);
          //   fromBoardsHttpActions.boardsPageLoaded();

          this.autoLogout(res);
        })
        // map((res) => fromBoardsHttpActions.boardsPageLoaded())
      ),
    { dispatch: false }
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions.pipe(
        ofType(fromAuthActions.LoginSuccess),
        tap((res) => {
          this.authService.isAuthLoading.next(false);

          localStorage.setItem('kanbanUser', JSON.stringify(res.user));
          this.router.navigate(['/', 'boards']);
          console.log(res.user);
          //   fromBoardsHttpActions.boardsPageLoaded();

          this.autoLogout(res);
        })
        // map((res) => fromBoardsHttpActions.boardsPageLoaded())
      ),
    { dispatch: false }
  );

  signUpFailure$ = createEffect(
    () =>
      this.actions.pipe(
        ofType(fromAuthActions.SignUpFailure),
        tap(() => {
          this.authService.isAuthLoading.next(false);
        })
      ),
    { dispatch: false }
  );

  loginFailure$ = createEffect(
    () =>
      this.actions.pipe(
        ofType(fromAuthActions.LoginFailure),
        tap((err) => {
          this.authService.isAuthLoading.next(false);
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions.pipe(
        ofType(fromAuthActions.Logout),
        tap(() => {
          localStorage.removeItem('kanbanUser');
          this.router.navigate(['/', 'auth', 'sign-in']);
        })
      ),
    { dispatch: false }
  );

  autoLogout(res: { user: AuthUser }) {
    const expirationTimeStored: number = res.user.expirationTime;

    if (expirationTimeStored != null) {
      const expirationTime = new Date(+expirationTimeStored).getTime();
      const currentTime = new Date().getTime();
      const expirationDuration = expirationTime - currentTime;
      this.authService.autoLogout(expirationDuration);
    }
  }

  getUserDetails(res: UserCredential) {
    const getUser: any = res.user;
    const expirationTime: number = getUser['stsTokenManager'].expirationTime;

    return {
      email: res.user.email!,
      displayName: res.user.displayName!,
      expirationTime: expirationTime,
      uid: res.user.uid!,
    };
  }

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
      case 'auth/invalid-login-credentials': {
        return 'Invalid login credentials';
      }
      default: {
        return 'An error occured, try again later';
      }
    }
  }
}
