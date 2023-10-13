import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

class ThemeServiceToInject {}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private renderer!: Renderer2;

  currentMode: string = 'light';
  themeState = new BehaviorSubject<string>(
    localStorage.getItem('theme') ? localStorage.getItem('theme')! : 'dark'
  );

  constructor(
    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: any
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);

    const theme = localStorage.getItem('theme');
    if (theme) {
      this.currentMode = theme;
      this.themeState.next(theme);
      this.saveTheme(theme);
    } else {
      localStorage.setItem('theme', 'dark');
      this.toggleTheme();
    }
  }

  toggleTheme() {
    if (this.currentMode == 'light') {
      this.renderer.addClass(this.document.body, 'dark');
      this.currentMode = 'dark';
      localStorage.setItem('theme', this.currentMode);
    } else {
      this.renderer.removeClass(this.document.body, 'dark');
      this.currentMode = 'light';
      localStorage.setItem('theme', this.currentMode);
    }
    this.themeState.next(this.currentMode);
  }

  saveTheme(theme: string) {
    if (theme == 'dark') {
      this.renderer.addClass(this.document.body, 'dark');
    } else {
      this.renderer.removeClass(this.document.body, 'dark');
    }
  }
}
