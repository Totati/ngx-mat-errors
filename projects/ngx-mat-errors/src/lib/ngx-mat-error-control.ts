import { Injectable, type Provider, inject } from '@angular/core';
import { MAT_FORM_FIELD } from '@angular/material/form-field';
import type { FormFieldControl } from './types';

/**
 * This class contains the logic to get the control or controls of MatFormField.
 */
@Injectable()
export class NgxMatErrorControl {
  protected readonly matFormField = inject(MAT_FORM_FIELD, { optional: true });
  public get(): undefined | FormFieldControl | FormFieldControl[] {
    return this.matFormField?._control;
  }
}

export function provideDefaultNgxMatErrorControl(): Provider {
  return {
    provide: NgxMatErrorControl,
  };
}
