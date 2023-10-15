import { formatDate } from '@angular/common';
import { FactoryProvider, LOCALE_ID } from '@angular/core';
import { DatepickerParseError, EndDateError, ErrorMessages, LengthError, MaxError, MinError, StartDateError } from '../error-messages';
import { NGX_MAT_ERROR_DEFAULT_OPTIONS } from '../ngx-mat-errors.component';

export function errorMessagesPtBtFactory(
  locale: string,
  format = 'shortDate'
): ErrorMessages {
  return {
    min: (error: MinError) =>
      `Informe um valor igual ou maior a ${error.min}.`,
    max: (error: MaxError) =>
      `Informe um valor igual ou menor a ${error.max}.`,
    required: `Campo obrigatório.`,
    email: `Informe um endereço de email válido.`,
    minlength: (error: LengthError) =>
      `Informe pelo menos ${error.requiredLength} caracteres.`,
    maxlength: (error: LengthError) =>
      `O campo não pode ter mais que ${error.requiredLength} caracteres.`,
    matDatepickerMin: (error: MinError<Date>) => {
      const formatted = formatDate(error.min, format, locale);
      return `Informe uma data maior ou igual a ${
        formatted ?? error.min
      }.`;
    },
    matDatepickerMax: (error: MaxError<Date>) => {
      const formatted = formatDate(error.max, format, locale);
      return `Informe uma data menor ou igual a ${
        formatted ?? error.max
      }.`;
    },
    matDatepickerParse: (error: DatepickerParseError) => `Invalid date format.`,
    matStartDateInvalid: (error: StartDateError<Date>) =>
      `Start date cannot be after end date.`,
    matEndDateInvalid: (error: EndDateError<Date>) =>
      `End date cannot be before start date.`,
    matDatepickerFilter: 'This date is filtered out.',
  };
}

export const NGX_MAT_ERROR_CONFIG_PT_BR: FactoryProvider = {
  provide: NGX_MAT_ERROR_DEFAULT_OPTIONS,
  useFactory: errorMessagesPtBtFactory,
  deps: [LOCALE_ID],
};
