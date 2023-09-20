import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import * as fromStore from '@store';
import * as fromAuthActions from '@authPageActions';

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
  isLoading: boolean = false;
  errorMessage: string = '';
  posterUrl: string = '';

  constructor(private store: Store<fromStore.State>) {}

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
  }

  get email() {
    return this.signInForm.controls['email'];
  }

  get password() {
    return this.signInForm.controls['password'];
  }

  onSignIn() {}

  onSignInWithGoogle() {
    this.store.dispatch(fromAuthActions.googleAuth());
  }
}
