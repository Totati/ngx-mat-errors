import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MdcRoutingModule } from './mdc-routing.module';
import { MdcComponent } from './mdc.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMatErrors, NgxMatErrorDef } from 'ngx-mat-errors';

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
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class MdcModule {}
