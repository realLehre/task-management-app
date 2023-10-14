import { createAction, props } from '@ngrx/store';
import { UserCredential } from '@angular/fire/auth';

import { AuthUser, User } from 'src/app/shared/models/user.model';

export const googleAuth = createAction('[AUTH GOOGLE] Google Auth');

export const SignUp = createAction(
  '[AUTH SIGNUP] SignUp',
  props<{ name: string; email: string; password: string }>()
);

export const SignUpSuccess = createAction(
  '[AUTH SIGNUP] SignUp Success',
  props<{ user: AuthUser }>()
);

export const SignUpFailure = createAction(
  '[AUTH SIGNUP] SignUp Failure',
  props<{ errorMessage: string }>()
);

export const Login = createAction(
  '[AUTH LOGIN] Login',
  props<{ email: string; password: string }>()
);

export const LoginSuccess = createAction(
  '[AUTH LOGIN] Login Success',
  props<{ user: AuthUser }>()
);

export const LoginFailure = createAction(
  '[AUTH LOGIN] Login Failure',
  props<{ errorMessage: string }>()
);

export const SendPasswordResetEmail = createAction(
  '[AUTH RESET] Password Reset Email',
  props<{ email: string }>()
);

export const SendPasswordResetEmailSuccess = createAction(
  '[AUTH RESET] Password Reset Email Success'
);

export const resetPassword = createAction(
  '[AUTH RESET] Password Reset',
  props<{ password: string; oobCode: string }>()
);

export const resetPasswordSuccess = createAction(
  '[AUTH RESET] Password Reset Success'
);

export const Logout = createAction('[AUTH] Logout');
