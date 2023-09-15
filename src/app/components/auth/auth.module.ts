import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthRoutingModule } from './auth-routing.module';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    AuthRoutingModule,
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [LoginComponent, SignUpComponent],
  exports: [],
})
export class AuthModule {}
