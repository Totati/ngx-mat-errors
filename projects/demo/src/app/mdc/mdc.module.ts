import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MdcRoutingModule } from './mdc-routing.module';
import { MdcComponent } from './mdc.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { NgxMatErrors, NgxMatErrorDef } from 'ngx-mat-errors';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [MdcComponent],
  imports: [
    CommonModule,
    MdcRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatErrors,
    NgxMatErrorDef,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class MdcModule {}
