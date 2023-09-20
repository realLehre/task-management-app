import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  updateProfile,
  UserCredential,
} from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable, defer, from, map } from 'rxjs';

import * as fromStore from '@store';
import * as fromAuthActions from '@authPageActions';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  logOutTimeout!: any;

  constructor(
    private auth: Auth,
    private store: Store<fromStore.State>,
    private router: Router
  ) {}

  getUser() {
    return JSON.parse(localStorage.getItem('user')!);
  }

  signUp(email: string, password: string): Observable<UserCredential> {
    return defer(() => {
      return from(createUserWithEmailAndPassword(this.auth, email, password));
    });
  }

  signInWithGoogle() {
    return defer(() => {
      return from(signInWithPopup(this.auth, new GoogleAuthProvider()));
    });
  }

  autoLogout(tokenExpirTime: number) {
    this.logOutTimeout = setTimeout(() => {
      this.store.dispatch(fromAuthActions.Logout());

      if (this.logOutTimeout) {
        clearTimeout(this.logOutTimeout);
      }
    }, tokenExpirTime);
  }
}
