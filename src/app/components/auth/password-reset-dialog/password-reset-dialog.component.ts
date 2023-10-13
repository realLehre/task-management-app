import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';

import * as fromStore from '@store';
import * as fromAuthActions from '@authPageActions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-password-reset-dialog',
  templateUrl: './password-reset-dialog.component.html',
  styleUrls: ['./password-reset-dialog.component.scss'],
})
export class PasswordResetDialogComponent implements OnInit {
  isSubmitting: boolean = false;
  isSending: boolean = true;
  isSent: boolean = false;
  emailForm!: FormGroup;
  constructor(
    private authService: AuthService,
    private store: Store<fromStore.State>
  ) {}

  ngOnInit(): void {
    this.emailForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
    });

    this.authService.isResetEmailSent.subscribe(
      (status) => (this.isSent = status)
    );
  }

  onSubmit() {
    if (this.emailForm.invalid) {
      return;
    }
    this.isSubmitting = true;

    this.store.dispatch(
      fromAuthActions.SendPasswordResetEmail(this.emailForm.value.email)
    );

    console.log(this.emailForm.value.email);
  }
}
