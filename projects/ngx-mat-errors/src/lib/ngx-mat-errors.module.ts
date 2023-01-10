import { NgModule } from '@angular/core';
import { NgxMatErrorDef, NgxMatErrorOutlet, NgxMatErrors } from './ngx-mat-errors.component';

@NgModule({
  imports: [NgxMatErrors, NgxMatErrorDef, NgxMatErrorOutlet],
  exports: [NgxMatErrors, NgxMatErrorDef],
})
export class NgxMatErrorsModule {}
