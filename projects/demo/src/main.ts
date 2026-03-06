import {
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { NGX_MAT_ERROR_CONFIG_EN } from 'ngx-mat-errors';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    NGX_MAT_ERROR_CONFIG_EN,
  ],
}).catch((err) => console.error(err));
