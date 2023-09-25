import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import * as fromStore from '@store';
import * as fromAuthActions from '@authPageActions';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { SessionExpiredComponent } from '../session-expired/session-expired.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  signInForm!: FormGroup;
  show: boolean = false;
  massError: boolean = false;
  returnUrl!: string;
  isAuthLoading: boolean = false;
  errorMessage!: string | null;
  posterUrl: string = '';

  constructor(
    private store: Store<fromStore.State>,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.signInForm = new FormGroup({
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])
      ),
      password: new FormControl('', Validators.compose([Validators.required])),
    });

    this.authService.isAuthLoading.subscribe(
      (status) => (this.isAuthLoading = status)
    );

    this.authService.errorMessage.subscribe((message) => {
      this.errorMessage = message.errorMessage;

      setTimeout(() => {
        this.errorMessage = null;
      }, 2000);
    });

    this.authService.isAutoLoggedOut.subscribe((status) => {
      if (status) {
        const dialogRef = this.dialog.open(SessionExpiredComponent, {
          panelClass: 'session_dialog',
          autoFocus: false,
        });
      }
    });
  }

  get email() {
    return this.signInForm.controls['email'];
  }

  get password() {
    return this.signInForm.controls['password'];
  }

  onSignIn() {
    if (this.signInForm.invalid) {
      return;
    }

    this.store.dispatch(
      fromAuthActions.Login({
        email: this.email.value,
        password: this.password.value,
      })
    );
  }

  onSignInWithGoogle() {
    this.store.dispatch(fromAuthActions.googleAuth());
  }
}
