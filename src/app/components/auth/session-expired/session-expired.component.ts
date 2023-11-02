import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';
import { ThemeService } from 'src/app/core/theme.service';

@Component({
  selector: 'app-session-expired',
  templateUrl: './session-expired.component.html',
  styleUrls: ['./session-expired.component.scss'],
})
export class SessionExpiredComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {}

  onCloseDialog() {
    this.authService.isAutoLoggedOut.next(false);
    this.dialog.closeAll();
  }
}
