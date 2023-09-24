import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import * as fromStore from '@store';
import * as fromAuthActions from '@authPageActions';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';

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
    private authService: AuthService
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

    this.store.select(fromStore.getErrorMessage).subscribe((err) => {
      this.errorMessage = err;
      setTimeout(() => {
        this.errorMessage = null;
        console.log(1);
      }, 2000);
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
