import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
  sendPasswordResetEmail,
  confirmPasswordReset,
} from '@angular/fire/auth';
import { Observable, Subject, defer, from } from 'rxjs';

import * as fromStore from '@store';
import * as fromAuthActions from '@authPageActions';
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  logOutTimeout!: any;
  isAuthLoading = new Subject<boolean>();
  errorMessage = new Subject<{ errorMessage: string }>();
  isAutoLoggedOut = new Subject<boolean>();
  isResetEmailSent = new Subject<boolean>();
  passwordResetSuccess = new Subject<boolean>();
  passwordResetError = new Subject<boolean>();
  production = environment.production;

  constructor(private auth: Auth, private store: Store<fromStore.State>) {}

  getUser() {
    return JSON.parse(localStorage.getItem('kanbanUser')!);
  }

  signUp(
    name: string,
    email: string,
    password: string
  ): Observable<UserCredential> {
    return defer(() => {
      return from(createUserWithEmailAndPassword(this.auth, email, password));
    });
  }

  login(email: string, password: string) {
    return defer(() => {
      return from(signInWithEmailAndPassword(this.auth, email, password));
    });
  }

  signInWithGoogle() {
    return defer(() => {
      return from(signInWithPopup(this.auth, new GoogleAuthProvider()));
    });
  }

  sendPasswordResetEmail(email: string) {
    const actionCodeSettings = {
      url: this.production
        ? 'http://localhost:4200/auth/password-reset'
        : 'https://ng-kanban.netlify.app/auth/password-reset',
    };
    return defer(() => {
      return from(sendPasswordResetEmail(this.auth, email, actionCodeSettings));
    });
  }

  resetPassword(newPassword: string, oobCode: string) {
    return defer(() => {
      return from(confirmPasswordReset(this.auth, oobCode, newPassword));
    });
  }

  autoLogout(tokenExpirTime: number) {
    this.logOutTimeout = setTimeout(() => {
      this.store.dispatch(fromAuthActions.Logout());
      this.isAutoLoggedOut.next(true);

      if (this.logOutTimeout) {
        clearTimeout(this.logOutTimeout);
      }
    }, tokenExpirTime);
  }
}
