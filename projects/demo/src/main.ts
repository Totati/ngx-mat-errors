import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { NGX_MAT_ERROR_CONFIG_EN } from 'ngx-mat-errors';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [provideAnimations(), NGX_MAT_ERROR_CONFIG_EN],
}).catch((err) => console.error(err));
