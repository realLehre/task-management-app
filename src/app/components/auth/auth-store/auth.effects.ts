import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Auth, updateProfile } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserCredential } from 'firebase/auth';

import { AuthService } from 'src/app/core/services/auth-service/auth.service';
import * as fromAuthActions from '@authPageActions';
import { TaskService } from 'src/app/core/services/task.service';
import { AuthUser } from 'src/app/shared/models/user.model';

@Injectable()
export class AuthEffects {
  constructor(
    private actions: Actions,
    private authService: AuthService,
    private taskService: TaskService,
    private router: Router,
    private auth: Auth
  ) {
    const expirationTimeStored = JSON.parse(
      localStorage.getItem('expirationTime')!
    );
    if (expirationTimeStored != null) {
      const expirationTime = new Date(+expirationTimeStored).getTime();
      const currentTime = new Date().getTime();
      const expirationDuration = expirationTime - currentTime;
      this.autoLogout(expirationDuration);
    }
  }

  login$ = createEffect(() =>
    this.actions.pipe(
      ofType(fromAuthActions.Login),
      concatMap((action) => {
        this.authService.isAuthLoading.next(true);
        return this.authService.login(action.email, action.password).pipe(
          tap((res) => {}),
          map((res) => {
            const user: AuthUser = this.getUserDetails(res);
            return fromAuthActions.LoginSuccess({ user: user });
          }),
          catchError((err) => {
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
            tap((res) => {}),
            map((res) => {
              const currentUser = this.auth.currentUser;
              if (currentUser !== null) {
                updateProfile(currentUser, {
                  displayName: action.name,
                });
              }

              const user: AuthUser = this.getUserDetails(res);

              return fromAuthActions.SignUpSuccess({
                user: { ...user, displayName: action.name },
              });
            }),
            catchError((err) => {
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
            const user: AuthUser = this.getUserDetails(res);
            this.taskService.setUserData(user);
          }),
          map((res) => {
            const user: AuthUser = this.getUserDetails(res);

            return fromAuthActions.LoginSuccess({ user: user });
          }),
          catchError((err) => {
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
          this.taskService.setUserData(res.user);
          localStorage.setItem(
            'expirationTime',
            JSON.stringify(res.user.expirationTime)
          );
          this.authService.isAuthLoading.next(false);

          localStorage.setItem('kanbanUser', JSON.stringify(res.user));
          this.router.navigate(['/', 'boards']);
          this.autoLogout(3600000);
        })
      ),
    { dispatch: false }
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions.pipe(
        ofType(fromAuthActions.LoginSuccess),
        tap((res) => {
          this.authService.isAuthLoading.next(false);
          localStorage.setItem(
            'expirationTime',
            JSON.stringify(res.user.expirationTime)
          );
          localStorage.setItem('kanbanUser', JSON.stringify(res.user));
          this.router.navigate(['/', 'boards']);

          this.autoLogout(3600000);
        })
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
          localStorage.removeItem('board_id');
          localStorage.removeItem('board_name');
          localStorage.removeItem('tasks');
          localStorage.removeItem('expirationTime');
          localStorage.removeItem('boardColumns');
          localStorage.removeItem('task');
          localStorage.removeItem('prevStatus');
          this.router.navigate(['/', 'auth', 'sign-in']);
        })
      ),
    { dispatch: false }
  );

  sendPasswordResetEmail$ = createEffect(() =>
    this.actions.pipe(
      ofType(fromAuthActions.SendPasswordResetEmail),
      mergeMap((action) => {
        return this.authService.sendPasswordResetEmail(action.email).pipe(
          map((data) => {
            return fromAuthActions.SendPasswordResetEmailSuccess();
          }),
          catchError((err) => {
            return of();
          })
        );
      })
    )
  );

  sendPasswordResetEmailSuccess$ = createEffect(
    () =>
      this.actions.pipe(
        ofType(fromAuthActions.SendPasswordResetEmailSuccess),
        tap((data) => {
          this.authService.isResetEmailSent.next(true);
        })
      ),
    { dispatch: false }
  );

  resetPassword$ = createEffect(() =>
    this.actions.pipe(
      ofType(fromAuthActions.resetPassword),
      mergeMap((action) => {
        return this.authService
          .resetPassword(action.password, action.oobCode)
          .pipe(
            map((data) => {
              return fromAuthActions.resetPasswordSuccess();
            }),
            catchError((err) => {
              this.authService.passwordResetError.next(true);
              return of();
            })
          );
      })
    )
  );

  resetPasswordSuccess$ = createEffect(
    () =>
      this.actions.pipe(
        ofType(fromAuthActions.resetPasswordSuccess),
        tap((data) => {
          this.authService.passwordResetSuccess.next(true);
        })
      ),
    { dispatch: false }
  );

  autoLogout(expirationDuration: number) {
    this.authService.autoLogout(expirationDuration);
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
      case 'auth/email-already-in-use':
        return 'Email already in use';

      case 'auth/wrong-password':
        return 'Password is incorrect';

      case 'auth/user-not-found':
        return 'User not found';

      case 'auth/invalid-login-credentials':
        return 'Invalid login credentials';

      case 'auth/network-request-failed':
        return 'Please check your internet connection';

      case 'auth/too-many-requests':
        return 'We have detected too many requests from your device. Take a break please!';

      case 'auth/user-disabled':
        return 'Your account has been disabled or deleted. Please contact the system administrator.';

      case 'auth/requires-recent-login':
        return 'Please login again and try again!';

      default:
        return 'Something went wrong. try again later!';
    }
  }
}
