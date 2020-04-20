import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxMatErrorDef, NgxMatErrorOutlet, NgxMatErrors } from './ngx-mat-errors.component';

@NgModule({
  declarations: [NgxMatErrors, NgxMatErrorDef, NgxMatErrorOutlet],
  imports: [CommonModule],
  exports: [NgxMatErrors, NgxMatErrorDef],
})
export class NgxMatErrorsModule {}
