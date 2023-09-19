import { Injectable } from '@angular/core';
import { Subject, map } from 'rxjs';
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
import { User } from 'src/app/shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  isDrawerOpened = new Subject<boolean>();
  isBoardMenuOpened = new Subject<boolean>();
  usersDatabase: AngularFirestoreCollection<User>;
  userIds: string[] = [];
  authResponse!: UserCredential;

  constructor(private auth: Auth, private db: AngularFirestore) {
    this.usersDatabase = this.db.collection('users');

    this.authResponse = JSON.parse(localStorage.getItem('user')!);
  }

  generateRandomString() {
    const randomChar =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567';

    let randomString = '';
    for (let d = 0; d < 20; d++) {
      randomString += randomChar.charAt(
        Math.floor(Math.random() * randomChar.length)
      );
    }
    return randomString;
  }

  setUserData(res: UserCredential) {
    if (this.userIds.some((uid) => uid == res.user.uid)) {
      return;
    }

    return this.usersDatabase.doc(res.user.uid).set({
      name: res.user.displayName,
      email: res.user.email,
      boards: [],
    });
  }

  // get user ids (document id in firestore collection)
  getUsersUid() {
    this.usersDatabase.get().subscribe((data) => {
      data.docs.forEach((doc) => {
        this.userIds.push(doc.id);
      });
    });
  }

  getBoards() {
    return this.usersDatabase.doc(this.authResponse.user.uid).get();
  }
}
