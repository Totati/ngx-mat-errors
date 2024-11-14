import { Injectable, type Provider, inject } from '@angular/core';
import { MAT_FORM_FIELD } from '@angular/material/form-field';
import type { FormFieldControl } from './types';

/**
 * This class contains the logic of getting the default control of a MatFormField.
 * Extend it to implement a custom getter method.
 */
@Injectable()
export class NgxMatErrorControl {
  protected readonly matFormField = inject(MAT_FORM_FIELD, { optional: true });
  public get(): undefined | FormFieldControl | FormFieldControl[] {
    return this.matFormField?._control;
  }
}

/**
 * Provides the default control accessor of a MatFormField.
 */
export function provideDefaultNgxMatErrorControl(): Provider {
  return {
    provide: NgxMatErrorControl,
  };
}
