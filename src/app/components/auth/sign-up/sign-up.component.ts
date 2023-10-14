import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import * as fromStore from '@store';
import * as fromAuthActions from '@authPageActions';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/core/theme.service';

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
  themeState!: string;
  isAuthLoading: boolean = false;
  authLoading$!: Subscription;
  authError$!: Subscription;

  constructor(
    private store: Store<fromStore.State>,
    private authService: AuthService,
    private toastr: ToastrService,
    private theme: ThemeService
  ) {}

  ngOnInit(): void {
    this.theme.themeState.subscribe((state) => (this.themeState = state));
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

    this.authLoading$ = this.authService.isAuthLoading.subscribe((status) => {
      this.isAuthLoading = status;
    });

    this.authError$ = this.authService.errorMessage.subscribe((message) => {
      this.toastr.error(message.errorMessage);
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

  ngOnDestroy(): void {
    this.authLoading$.unsubscribe();
    this.authError$.unsubscribe();
  }
}
