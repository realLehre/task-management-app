import { Component, OnDestroy, OnInit } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import * as fromStore from '@store';
import * as fromAuthActions from '@authPageActions';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { SessionExpiredComponent } from '../session-expired/session-expired.component';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/core/theme.service';
import { PasswordResetDialogComponent } from '../password-reset-dialog/password-reset-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  signInForm!: FormGroup;
  show: boolean = false;
  massError: boolean = false;
  returnUrl!: string;
  isAuthLoading: boolean = false;
  authLoading$!: Subscription;
  themeState!: string;
  authError$!: Subscription;

  constructor(
    private store: Store<fromStore.State>,
    private authService: AuthService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private theme: ThemeService
  ) {}

  ngOnInit(): void {
    this.theme.themeState.subscribe((state) => (this.themeState = state));
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

    this.authLoading$ = this.authService.isAuthLoading.subscribe(
      (status) => (this.isAuthLoading = status)
    );

    this.authError$ = this.authService.errorMessage.subscribe((message) => {
      this.toastr.error(message.errorMessage);
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

  onResetPassword() {
    const dialogRef = this.dialog.open(PasswordResetDialogComponent, {
      panelClass: 'board_dialog',
      autoFocus: false,
    });
  }

  ngOnDestroy(): void {
    this.authLoading$.unsubscribe();
    this.authError$.unsubscribe();
  }
}
