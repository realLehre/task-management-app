import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromStore from '@store';
import * as fromAuthActions from '@authPageActions';
import { ThemeService } from 'src/app/core/theme.service';

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
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.emailForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
    });

    this.authService.isResetEmailSent.pipe(take(1)).subscribe((status) => {
      this.isSent = status;
      this.isSubmitting = !status;
      this.isSending = !status;
    });
  }

  onSubmit() {
    if (this.emailForm.invalid) {
      return;
    }
    this.isSubmitting = true;

    this.store.dispatch(
      fromAuthActions.SendPasswordResetEmail({
        email: this.emailForm.value.email,
      })
    );
  }

  onContinue() {
    this.dialog.closeAll();
  }
}
