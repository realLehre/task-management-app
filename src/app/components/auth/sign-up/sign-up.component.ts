import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import * as fromStore from '@store';
import * as fromAuthActions from '@authPageActions';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  signUpForm!: FormGroup;
  show: boolean = false;
  showConfirm: boolean = false;
  tellPasswordHint: boolean = false;
  tellEmailHint: boolean = false;
  passwordMatch: boolean = false;
  isLoading: boolean = false;
  isAuthLoading: boolean = false;
  errorMessage!: string | null;
  posterUrl: string = '';

  constructor(
    private store: Store<fromStore.State>,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{6,}$'
        ),
      ]),
      confirmPassword: new FormControl('', Validators.required),
    });

    this.authService.isAuthLoading.subscribe(
      (status) => (this.isAuthLoading = status)
    );

    this.store.select(fromStore.getErrorMessage).subscribe((err) => {
      this.errorMessage = err;
      console.log(this.errorMessage, err);

      setTimeout(() => {
        this.errorMessage = null;
      }, 2000);
      console.log(this.errorMessage);
    });
  }

  ngAfterViewChecked(): void {}

  get name() {
    return this.signUpForm.controls['name'];
  }

  get email() {
    return this.signUpForm.controls['email'];
  }

  get password() {
    return this.signUpForm.controls['password'];
  }

  get confirmPassword() {
    return this.signUpForm.controls['confirmPassword'];
  }

  tell(type: string) {
    switch (type) {
      case 'password': {
        this.tellPasswordHint = true;
        break;
      }
      case 'email': {
        this.tellEmailHint = true;
        break;
      }
      default: {
        return;
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
    if (this.signUpForm.invalid) {
      return;
    }

    const { ...credentials } = this.signUpForm.value;
    console.log(credentials);

    this.store.dispatch(
      fromAuthActions.SignUp({
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
      })
    );
  }

  onSignInWithGoogle() {
    this.store.dispatch(fromAuthActions.googleAuth());
  }
}
