import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { NgxMatErrorDef, NgxMatErrors, NgxMatErrorsForDateRangePicker } from 'ngx-mat-errors';
import { AsyncMinLengthValidator } from '../async-validator.directive';
import { MdcRoutingModule } from './mdc-routing.module';
import { MdcComponent } from './mdc.component';

@NgModule({
  declarations: [MdcComponent],
  imports: [
    CommonModule,
    MdcRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMatErrors,
    NgxMatErrorDef,
    MatCardModule,
    MatRadioModule,
    ReactiveFormsModule,
    FormsModule,
    AsyncMinLengthValidator,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatErrorsForDateRangePicker
  ],
})
export class MdcModule {}
