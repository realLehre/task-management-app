import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription, take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

import { ThemeService } from 'src/app/core/theme.service';
import * as fromStore from '@store';
import * as fromAuthActions from '@authPageActions';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent implements OnInit, OnDestroy {
  themeState!: string;
  passwordForm!: FormGroup;
  show: boolean = false;
  showConfirm: boolean = false;
  tellPasswordHint: boolean = false;
  passwordMatch: boolean = false;
  isLoading: boolean = false;
  isAuthLoading: boolean = false;
  authLoading$!: Subscription;
  authError$!: Subscription;
  isResettingPassword: boolean = true;
  passwordResetSuccess: boolean = false;
  oobCode!: string;

  constructor(
    private theme: ThemeService,
    private store: Store<fromStore.State>,
    private authService: AuthService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.theme.themeState.subscribe((state) => (this.themeState = state));

    this.passwordForm = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{6,}$'
        ),
      ]),
      confirmPassword: new FormControl('', Validators.required),
    });

    this.authLoading$ = this.authService.passwordResetSuccess.subscribe(
      (status) => {
        this.passwordResetSuccess = status;
        this.isResettingPassword = !status;
        this.isAuthLoading = !status;
      }
    );

    this.authError$ = this.authService.passwordResetError.subscribe(
      (status) => {
        this.toastr.error('Something went wrong. Try again later!');
      }
    );

    this.route.queryParams.subscribe((param) => {
      this.oobCode = param['oobCode'];
    });
  }

  ngAfterViewChecked(): void {}

  get password() {
    return this.passwordForm.controls['password'];
  }

  get confirmPassword() {
    return this.passwordForm.controls['confirmPassword'];
  }

  tell(type: string) {
    switch (type) {
      case 'password': {
        this.tellPasswordHint = true;
        break;
      }
    }
  }

  onKey(event: any) {
    if (this.password.value === this.confirmPassword.value) {
      this.passwordMatch = true;
    } else {
      this.passwordMatch = false;
    }
  }

  onToggleVisibility(status: string) {
    if (status == 'password') {
      this.show = !this.show;
    } else {
      this.showConfirm = !this.showConfirm;
    }
  }

  onSubmit() {
    if (this.passwordForm.invalid) {
      return;
    }

    this.isAuthLoading = true;

    this.store.dispatch(
      fromAuthActions.resetPassword({
        password: this.password.value,
        oobCode: this.oobCode,
      })
    );
  }

  onLogin() {
    this.router.navigate(['../sign-in']);
    this.dialog.closeAll();
  }

  ngOnDestroy(): void {
    this.authLoading$.unsubscribe();
    this.authError$.unsubscribe();
  }
}
