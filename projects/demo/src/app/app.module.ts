import { NgModule, Provider } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  DEFAULT_ERROR_MESSAGES,
  MinError,
  NGX_MAT_ERROR_DEFAULT_OPTIONS,
} from 'ngx-mat-errors';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

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
    MatButtonModule,
    MatToolbarModule,
  ],
  providers: [NGX_MAT_ERROR_DEFAULT_CONFIG],
  bootstrap: [AppComponent],
})
export class AppModule {}
