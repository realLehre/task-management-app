import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthRoutingModule } from './auth-routing.module';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './auth-store/auth.effects';
import { SessionExpiredComponent } from './session-expired/session-expired.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { PasswordResetDialogComponent } from './password-reset-dialog/password-reset-dialog.component';

@NgModule({
  imports: [
    AuthRoutingModule,
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    EffectsModule.forFeature([AuthEffects]),
  ],
  declarations: [
    LoginComponent,
    SignUpComponent,
    SessionExpiredComponent,
    PasswordResetComponent,
    PasswordResetDialogComponent,
  ],
  exports: [LoginComponent, SignUpComponent],
})
export class AuthModule {}
