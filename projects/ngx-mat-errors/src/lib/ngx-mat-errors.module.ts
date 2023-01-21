import { NgModule } from '@angular/core';
import { NgxMatErrorDef, NgxMatErrors } from './ngx-mat-errors.component';

@NgModule({
  imports: [NgxMatErrors, NgxMatErrorDef],
  exports: [NgxMatErrors, NgxMatErrorDef],
})
export class NgxMatErrorsModule {}
