import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { NgxMatErrorDef, NgxMatErrors } from 'ngx-mat-errors';
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
  ],
})
export class MdcModule {}
