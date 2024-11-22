import { formatDate } from '@angular/common';
import { type FactoryProvider, LOCALE_ID } from '@angular/core';
import type {
  EndDateError,
  ErrorMessages,
  LengthError,
  MaxError,
  MinError,
  StartDateError,
  ParseError,
} from '../types';
import { NGX_MAT_ERROR_DEFAULT_OPTIONS } from '../ngx-mat-errors.component';

export function errorMessagesEnFactory(
  locale: string,
  dateFormat = 'shortDate',
  timeFormat = 'shortTime'
): ErrorMessages {
  return {
    min: (error: MinError) =>
      `Please enter a value greater than or equal to ${error.min}.`,
    max: (error: MaxError) =>
      `Please enter a value less than or equal to ${error.max}.`,
    required: `This field is required.`,
    email: `Please enter a valid email address.`,
    minlength: (error: LengthError) =>
      `Please enter at least ${error.requiredLength} characters.`,
    maxlength: (error: LengthError) =>
      `Please enter no more than ${error.requiredLength} characters.`,
    matDatepickerMin: (error: MinError<Date>) => {
      const formatted = formatDate(error.min, dateFormat, locale);
      return `Please enter a date greater than or equal to ${
        formatted ?? error.min
      }.`;
    },
    matDatepickerMax: (error: MaxError<Date>) => {
      const formatted = formatDate(error.max, dateFormat, locale);
      return `Please enter a date less than or equal to ${
        formatted ?? error.max
      }.`;
    },
    matDatepickerParse: (error: ParseError) => `Invalid date format.`,
    matStartDateInvalid: (error: StartDateError<Date>) =>
      `Start date cannot be after end date.`,
    matEndDateInvalid: (error: EndDateError<Date>) =>
      `End date cannot be before start date.`,
    matDatepickerFilter: 'This date is filtered out.',
    matTimepickerParse: (error: ParseError) => `Invalid time format.`,
    matTimepickerMin: (error: MinError<Date>) => {
      const formatted = formatDate(error.min, timeFormat, locale);
      return `Please enter a time greater than or equal to ${
        formatted ?? error.min
      }.`;
    },
    matTimepickerMax: (error: MaxError<Date>) => {
      const formatted = formatDate(error.max, timeFormat, locale);
      return `Please enter a time less than or equal to ${
        formatted ?? error.max
      }.`;
    },
  };
}

export const NGX_MAT_ERROR_CONFIG_EN: FactoryProvider = {
  provide: NGX_MAT_ERROR_DEFAULT_OPTIONS,
  useFactory: errorMessagesEnFactory,
  deps: [LOCALE_ID],
};
