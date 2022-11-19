import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Provider } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import {
  NgxMatErrorsModule,
  NGX_MAT_ERROR_DEFAULT_OPTIONS,
  DEFAULT_ERROR_MESSAGES,
  MinError,
} from 'ngx-mat-errors';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export const NGX_MAT_ERROR_DEFAULT_CONFIG: Provider = {
  useFactory: () => {
    return {
      ...DEFAULT_ERROR_MESSAGES,
      min: (error: MinError) =>
        `Min value is ${error.min}, actual is ${error.actual}`,
    };
  },
  provide: NGX_MAT_ERROR_DEFAULT_OPTIONS,
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMatErrorsModule,
    MatToolbarModule,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [NGX_MAT_ERROR_DEFAULT_CONFIG],
  bootstrap: [AppComponent],
})
export class AppModule {}
