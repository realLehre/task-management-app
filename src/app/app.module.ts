import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TasksModule } from './components/tasks/tasks.module';
import { HeaderComponent } from './components/header/header.component';
import { MaterialModule } from './material.module';
import { DialogComponent } from './shared/dialog/dialog.component';
import * as fromApp from './shared/store/app.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [AppComponent, HeaderComponent, DialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    TasksModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(fromApp.appReducer),
    StoreDevtoolsModule.instrument({
      name: 'Kanban Task Management App',
      logOnly: environment.production,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
