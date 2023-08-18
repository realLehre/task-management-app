import { NgModule } from '@angular/core';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  imports: [
    MatSidenavModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCheckboxModule,
  ],
  exports: [
    MatSidenavModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCheckboxModule,
  ],
})
export class MaterialModule {}
