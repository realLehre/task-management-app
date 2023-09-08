import { NgModule } from '@angular/core';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    MatSidenavModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatMenuModule,
    MatSnackBarModule,
    DragDropModule,
  ],
  exports: [
    MatSidenavModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatMenuModule,
    MatSnackBarModule,
    DragDropModule,
  ],
})
export class MaterialModule {}
