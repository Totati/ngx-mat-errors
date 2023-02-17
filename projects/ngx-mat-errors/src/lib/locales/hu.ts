import { formatDate } from '@angular/common';
import { FactoryProvider, LOCALE_ID } from '@angular/core';
import {
  DatepickerParseError,
  EndDateError,
  ErrorMessages,
  LengthError,
  MaxError,
  MinError,
  StartDateError,
} from '../error-messages';
import { NGX_MAT_ERROR_DEFAULT_OPTIONS } from '../ngx-mat-errors.component';

export function errorMessagesHuFactory(
  locale: string,
  format = 'shortDate'
): ErrorMessages {
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
      // In Hungarian date ends with '.'
      return `Nem lehet korábbi dátum, mint ${formatted ?? error.min}`;
    },
    matDatepickerMax: (error: MaxError) => {
      const formatted = formatDate(error.max, format, locale);
      // In Hungarian date ends with '.'
      return `Nem lehet későbbi dátum, mint ${formatted ?? error.max}`;
    },
    matStartDateInvalid: (error: StartDateError) => {
      const formatted = formatDate(error.end, format, locale);
      return `Nem lehet a kezdő dátum későbbi, mint ${
        formatted ?? error.end
      }.`;
    },
    matEndDateInvalid: (error: EndDateError) => {
      const formatted = formatDate(error.start, format, locale);
      return `Nem lehet a vég dátum korábbi, mint ${
        formatted ?? error.start
      }.`;
    },
    matDatepickerParse: (error: DatepickerParseError) =>
      `A dátum '${error.text}' érvénytelen.`,
  };
}

export const NGX_MAT_ERROR_CONFIG_HU: FactoryProvider = {
  provide: NGX_MAT_ERROR_DEFAULT_OPTIONS,
  useFactory: errorMessagesHuFactory,
  deps: [LOCALE_ID],
};
