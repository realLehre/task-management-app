import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { MainComponent } from './main.component';
import { MaterialModule } from 'src/app/material.module';
import { TasksModule } from './tasks/tasks.module';
import { HeaderComponent } from './header/header.component';
import { MainRoutingModule } from './main-routing.module';

@NgModule({
  declarations: [MainComponent, HeaderComponent],
  imports: [
    MaterialModule,
    TasksModule,
    MainRoutingModule,
    CommonModule,
    NgxSkeletonLoaderModule.forRoot({
      animation: 'pulse',
      loadingText: 'This item is actually loading...',
      theme: { height: '40px' },
      appearance: 'line',
    }),
  ],
  exports: [],
})
export class MainModule {}
