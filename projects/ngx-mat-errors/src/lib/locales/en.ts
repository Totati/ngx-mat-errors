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

export function errorMessagesEnFactory(
  locale: string,
  format = 'shortDate'
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
    matDatepickerMin: (error: MinError) => {
      const formatted = formatDate(error.min, format, locale);
      return `Please enter a date greater than or equal to ${
        formatted ?? error.min
      }.`;
    },
    matDatepickerMax: (error: MaxError) => {
      const formatted = formatDate(error.max, format, locale);
      return `Please enter a date less than or equal to ${
        formatted ?? error.max
      }.`;
    },
    matStartDateInvalid: (error: StartDateError) => {
      const formatted = formatDate(error.end, format, locale);
      return `Please enter a start date less than or equal to ${
        formatted ?? error.end
      }.`;
    },
    matEndDateInvalid: (error: EndDateError) => {
      const formatted = formatDate(error.start, format, locale);
      return `Please enter an end date greater than or equal to ${
        formatted ?? error.start
      }.`;
    },
    matDatepickerParse: (error: DatepickerParseError) =>
      `Date '${error.text}' is invalid.`,
  };
}

export const NGX_MAT_ERROR_CONFIG_EN: FactoryProvider = {
  provide: NGX_MAT_ERROR_DEFAULT_OPTIONS,
  useFactory: errorMessagesEnFactory,
  deps: [LOCALE_ID],
};
