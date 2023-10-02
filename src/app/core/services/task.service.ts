import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, defer, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Auth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { FieldValue, arrayUnion } from 'firebase/firestore';

import { AuthUser, User } from 'src/app/shared/models/user.model';
import { Board } from 'src/app/shared/models/board.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  isDrawerOpened = new Subject<boolean>();
  isBoardMenuOpened = new Subject<boolean>();
  usersDatabase: AngularFirestoreCollection<User>;
  userIds: string[] = [];
  authResponse!: AuthUser;
  isSubmitting = new Subject<boolean>();
  isLoadingBoards = new BehaviorSubject<boolean>(false);

  constructor(private auth: Auth, private db: AngularFirestore) {
    this.usersDatabase = this.db.collection('users');

    this.authResponse = JSON.parse(localStorage.getItem('kanbanUser')!);

    this.getUsersUid();
    this.getBoards();
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

  // get user ids (document id in firestore collection)
  getUsersUid() {
    this.usersDatabase.get().subscribe((data) => {
      data.docs.forEach((doc) => {
        this.userIds.push(doc.id);
      });
    });
  }

  setUserData(res: AuthUser) {
    if (this.userIds.some((uid) => uid == res.uid)) {
      return;
    }

    return this.usersDatabase.doc(res.uid).set({
      name: res.displayName,
      email: res.email,
      boards: [],
    });
  }

  getBoards() {
    let uid;
    if (localStorage.getItem('kanbanUser')) {
      uid = JSON.parse(localStorage.getItem('kanbanUser')!).uid;
    }
    return this.usersDatabase
      .doc(uid)
      .get()
      .pipe(
        map((data) => {
          return data.data()?.boards;
        })
      );
  }

  createBoard(board: Board) {
    const uid = JSON.parse(localStorage.getItem('kanbanUser')!).uid;

    const user = this.usersDatabase.doc(uid);
    let boards: Board[] = [];

    return defer(() => {
      return from(
        user.get().pipe(
          map((data) => {
            boards = data.data()?.boards!;
            this.usersDatabase.doc(uid).update({
              boards: [...boards, board],
            });
            return board;
          })
        )
      );
    });
  }

  updateBoards(newBoard: Board) {
    const uid = JSON.parse(localStorage.getItem('kanbanUser')!).uid;

    const user = this.usersDatabase.doc(uid);
    let boards: Board[];
    return defer(() => {
      return from(
        user.get().pipe(
          map((data) => {
            boards = data.data()?.boards!;

            const oldBoard = boards.find((board) => board.id == newBoard.id);

            const updatedBoard = {
              ...oldBoard,
              ...newBoard,
            };

            const boardIndex = boards.findIndex(
              (board) => board.id == newBoard.id
            );

            const updateBoards = [...boards];

            updateBoards[boardIndex] = updatedBoard;

            this.usersDatabase.doc(uid).update({
              boards: [...updateBoards],
            });
            return updateBoards;
          })
        )
      );
    });
  }

  deleteBoard(boardId: string) {
    const uid = JSON.parse(localStorage.getItem('kanbanUser')!).uid;

    const user = this.usersDatabase.doc(uid);
    let boards: Board[];
    return defer(() => {
      return from(
        user.get().pipe(
          map((data) => {
            boards = data.data()?.boards!;
            boards = boards.filter((board) => board.id != boardId);

            this.usersDatabase.doc(uid).update({
              boards: [...boards],
            });
            return boards;
          })
        )
      );
    });
  }
}
