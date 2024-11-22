import { formatDate } from '@angular/common';
import { type FactoryProvider, LOCALE_ID } from '@angular/core';
import type {
  ParseError,
  EndDateError,
  ErrorMessages,
  LengthError,
  MaxError,
  MinError,
  StartDateError,
} from '../types';
import { NGX_MAT_ERROR_DEFAULT_OPTIONS } from '../ngx-mat-errors.component';

export function errorMessagesHuFactory(
  locale: string,
  dateFormat = 'shortDate',
  timeFormat = 'shortTime'
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
    matDatepickerMin: (error: MinError<Date>) => {
      const formatted = formatDate(error.min, dateFormat, locale);
      // In Hungarian date ends with '.'
      return `Nem lehet korábbi dátum, mint ${formatted ?? error.min}`;
    },
    matDatepickerMax: (error: MaxError<Date>) => {
      const formatted = formatDate(error.max, dateFormat, locale);
      // In Hungarian date ends with '.'
      return `Nem lehet későbbi dátum, mint ${formatted ?? error.max}`;
    },
    matDatepickerParse: (error: ParseError) => `Érvénytelen dátum.`,
    matStartDateInvalid: (error: StartDateError<Date>) =>
      `A kezdő dátum nem lehet a vég dátum után.`,
    matEndDateInvalid: (error: EndDateError<Date>) =>
      `A vég dátum nem lehet a kezdő dátum előtt.`,
    matDatepickerFilter: 'Ez a dátum nem engedélyezett.',
    matTimepickerParse: (error: ParseError) => `Érvénytelen idő.`,
    matTimepickerMin: (error: MinError<Date>) => {
      const formatted = formatDate(error.min, timeFormat, locale);
      return `Nem lehet korábbi idő, mint ${
        formatted ?? error.min
      }.`;
    },
    matTimepickerMax: (error: MaxError<Date>) => {
      const formatted = formatDate(error.max, timeFormat, locale);
      return `Nem lehet későbbi idő, mint  ${
        formatted ?? error.max
      }.`;
    },
  };
}

export const NGX_MAT_ERROR_CONFIG_HU: FactoryProvider = {
  provide: NGX_MAT_ERROR_DEFAULT_OPTIONS,
  useFactory: errorMessagesHuFactory,
  deps: [LOCALE_ID],
};
