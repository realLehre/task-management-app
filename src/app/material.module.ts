import { NgModule } from '@angular/core';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [MatSidenavModule, MatDialogModule],
  exports: [MatSidenavModule, MatDialogModule],
})
export class MaterialModule {}
