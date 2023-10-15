import { NgModule } from '@angular/core';
import { NgxMatErrorDef } from './ngx-mat-error-def.directive';
import { NgxMatErrors } from './ngx-mat-errors.component';

@NgModule({
  imports: [NgxMatErrors, NgxMatErrorDef],
  exports: [NgxMatErrors, NgxMatErrorDef],
})
export class NgxMatErrorsModule {}
