import { createReducer, createSelector, on } from '@ngrx/store';
import { UserCredential } from '@angular/fire/auth';

import { User } from 'src/app/shared/models/user.model';
import * as fromAuthActions from '@authPageActions';

export interface AuthState {
  user: UserCredential | null;
  isAuthenticated: boolean;
  errorMessage: string | null;
}

const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  errorMessage: null,
};

export const authReducer = createReducer(
  initialAuthState,
  on(fromAuthActions.SignUpSuccess, (state, actions) => {
    return {
      ...state,
      user: actions.user,
      isAuthenticated: true,
    };
  }),

  on(fromAuthActions.SignUpFailure, (state, actions) => {
    return {
      ...state,
      errorMessage: actions.errorMessage,
    };
  }),

  on(fromAuthActions.LoginSuccess, (state, actions) => {
    return {
      ...state,
      user: actions.user,
      isAuthenticated: true,
    };
  }),

  on(fromAuthActions.LoginFailure, (state, actions) => {
    return {
      ...state,
      errorMessage: actions.errorMessage,
    };
  }),

  on(fromAuthActions.Logout, (state) => {
    return initialAuthState;
  })
);

export const getUser = (state: AuthState) => state.user;

export const getAuthenticationState = (state: AuthState) =>
  state.isAuthenticated;

export const getErrorMessage = (state: AuthState) => state.errorMessage;
