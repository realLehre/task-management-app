import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { localStorageSync } from 'ngrx-store-localstorage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { DialogComponent } from './shared/dialog/dialog.component';
import * as fromApp from './store/app.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';

import * as fromStore from 'src/app/store/app.reducer';
import { AuthModule } from './components/auth/auth.module';
import { MainModule } from './components/main/main.module';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

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
    HttpClientModule,
    MainModule,
    AuthModule,
    StoreModule.forRoot(fromApp.appReducer, {
      metaReducers,
    }),
    StoreDevtoolsModule.instrument({
      name: 'Kanban Task Management App',
      logOnly: environment.production,
    }),
    EffectsModule.forRoot([]),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
