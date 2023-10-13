import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/core/theme.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent implements OnInit {
  themeState!: string;
  constructor(private theme: ThemeService) {}

  ngOnInit(): void {
    this.theme.themeState.subscribe((state) => (this.themeState = state));
  }
}
