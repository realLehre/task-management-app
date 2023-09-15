import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TasksModule } from './components/main/tasks/tasks.module';
import { HeaderComponent } from './components/main/header/header.component';
import { MaterialModule } from './material.module';
import { DialogComponent } from './shared/dialog/dialog.component';
import * as fromApp from './store/app.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';

import * as fromStore from 'src/app/store/app.reducer';
import { localStorageSync } from 'ngrx-store-localstorage';
import { AuthModule } from './components/auth/auth.module';
import { MainModule } from './components/main/main.module';

const reducers = {
  boards: fromStore.getBoardsState,
};

function localStorageSyncReducer(
  reducer: ActionReducer<fromStore.State>
): ActionReducer<fromStore.State> {
  return localStorageSync({
    keys: [{ boards: ['boards'] }],
    rehydrate: true,
  })(reducer);
}

const metaReducers: Array<MetaReducer<fromStore.State, any>> = [
  localStorageSyncReducer,
];

@NgModule({
  declarations: [AppComponent, DialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    MainModule,
    AuthModule,
    StoreModule.forRoot(fromApp.appReducer, {
      metaReducers,
    }),
    StoreDevtoolsModule.instrument({
      name: 'Kanban Task Management App',
      logOnly: environment.production,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
