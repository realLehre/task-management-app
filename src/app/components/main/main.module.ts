import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MainComponent } from './main.component';
import { MaterialModule } from 'src/app/material.module';
import { TasksModule } from './tasks/tasks.module';
import { HeaderComponent } from './header/header.component';
import { MainRoutingModule } from './main-routing.module';

@NgModule({
  declarations: [MainComponent, HeaderComponent],
  imports: [MaterialModule, TasksModule, MainRoutingModule, CommonModule],
  exports: [],
})
export class MainModule {}
