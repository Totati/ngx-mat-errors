import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LegacyRoutingModule } from './legacy-routing.module';
import { LegacyComponent } from './legacy.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule } from '@angular/material/legacy-input';
import { NgxMatErrors, NgxMatErrorDef } from 'ngx-mat-errors';

@NgModule({
  declarations: [LegacyComponent],
  imports: [
    CommonModule,
    LegacyRoutingModule,
    MatLegacyFormFieldModule,
    MatLegacyInputModule,
    NgxMatErrors,
    NgxMatErrorDef,
    MatLegacyCardModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class LegacyModule {}
