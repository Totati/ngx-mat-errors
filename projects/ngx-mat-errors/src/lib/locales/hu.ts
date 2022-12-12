import { formatDate } from '@angular/common';
import { FactoryProvider, LOCALE_ID } from '@angular/core';
import { ErrorMessages, LengthError, MaxError, MinError } from '../error-meassages';
import { NGX_MAT_ERROR_DEFAULT_OPTIONS } from '../ngx-mat-errors.component';

export function errorMessagesHuFactory(locale: string, format = 'shortDate'): ErrorMessages {
  return {
    min: (error: MinError) => `Nem lehet kisebb, mint ${error.min}.`,
    max: (error: MaxError) => `Nem lehet nagyobb, mint ${error.max}.`,
    required: `Kötelező mező.`,
    email: `Nem érvényes e-mail cím.`,
    minlength: (error: LengthError) =>
      `Legalább ${error.requiredLength} karakter hosszú lehet.`,
    maxlength: (error: LengthError) =>
      `Legfeljebb ${error.requiredLength} karakter hosszú lehet.`,
    server: (error: string) => error,
    matDatepickerMin: (error: MinError) => {
      const formatted = formatDate(error.min, format, locale);
      // In Hungarian dates are ending with '.'
      return `Nem lehet korábbi dátum, mint ${formatted ?? error.min}`;
    },
    matDatepickerMax: (error: MaxError) => {
      const formatted = formatDate(error.max, format, locale);
      // In Hungarian dates are ending with '.'
      return `Nem lehet későbbi dátum, mint ${formatted ?? error.max}`;
    },
  };
}

export const NGX_MAT_ERROR_CONFIG_HU: FactoryProvider = {
  provide: NGX_MAT_ERROR_DEFAULT_OPTIONS,
  useFactory: errorMessagesHuFactory,
  deps: [LOCALE_ID]
};
