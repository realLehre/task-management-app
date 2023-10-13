import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
  sendPasswordResetEmail,
} from '@angular/fire/auth';
import { Observable, Subject, defer, from, map } from 'rxjs';

import * as fromStore from '@store';
import * as fromAuthActions from '@authPageActions';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  logOutTimeout!: any;
  isAuthLoading = new Subject<boolean>();
  errorMessage = new Subject<{ errorMessage: string }>();
  isAutoLoggedOut = new Subject<boolean>();
  isResetEmailSent = new Subject<boolean>();

  constructor(
    private auth: Auth,
    private store: Store<fromStore.State>,
    private router: Router
  ) {}

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
    return defer(() => {
      return from(sendPasswordResetEmail(this.auth, email));
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
