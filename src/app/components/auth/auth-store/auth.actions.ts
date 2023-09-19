import { createAction, props } from '@ngrx/store';
import { UserCredential } from '@angular/fire/auth';

import { User } from 'src/app/shared/models/user.model';

export const googleAuth = createAction('AUTH GOOGLE] Google Auth');

export const SignUp = createAction(
  '[AUTH SIGNUP] SignUp',
  props<{ email: string; password: string }>()
);

export const SignUpSuccess = createAction(
  '[AUTH SIGNUP] SignUp Success',
  props<{ user: UserCredential }>()
);

export const SignUpFailure = createAction(
  '[AUTH SIGNUP] SignUp Failure',
  props<{ errorMessage: string }>()
);

export const Login = createAction(
  '[AUTH LOGIN] Login',
  props<{ user: User }>()
);

export const LoginSuccess = createAction(
  '[AUTH LOGIN] Login Success',
  props<{ user: UserCredential }>()
);

export const LoginFailure = createAction(
  '[AUTH LOGIN] Login Failure',
  props<{ errorMessage: string }>()
);

export const Logout = createAction('[AUTH] Logout');
