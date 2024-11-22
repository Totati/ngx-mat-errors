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

export function errorMessagesPtBtFactory(
  locale: string,
  dateFormat = 'shortDate',
  timeFormat = 'shortTime'
): ErrorMessages {
  return {
    min: (error: MinError) => `Informe um valor igual ou maior a ${error.min}.`,
    max: (error: MaxError) => `Informe um valor igual ou menor a ${error.max}.`,
    required: `Campo obrigatório.`,
    email: `Informe um endereço de email válido.`,
    minlength: (error: LengthError) =>
      `Informe pelo menos ${error.requiredLength} caracteres.`,
    maxlength: (error: LengthError) =>
      `O campo não pode ter mais que ${error.requiredLength} caracteres.`,
    matDatepickerMin: (error: MinError<Date>) => {
      const formatted = formatDate(error.min, dateFormat, locale);
      return `Informe uma data maior ou igual a ${formatted ?? error.min}.`;
    },
    matDatepickerMax: (error: MaxError<Date>) => {
      const formatted = formatDate(error.max, dateFormat, locale);
      return `Informe uma data menor ou igual a ${formatted ?? error.max}.`;
    },
    matDatepickerParse: (error: ParseError) => `Formato de data inválido.`,
    matStartDateInvalid: (error: StartDateError<Date>) =>
      `A data de início não pode ser posterior à data de término.`,
    matEndDateInvalid: (error: EndDateError<Date>) =>
      `A data de término não pode ser anterior à data de início.`,
    matDatepickerFilter: 'Esta data é filtrada.',
    matTimepickerParse: (error: ParseError) => `Formato de hora inválido.`,
    matTimepickerMin: (error: MinError<Date>) => {
      const formatted = formatDate(error.min, timeFormat, locale);
      return `Insira um horário maior ou igual a ${
        formatted ?? error.min
      }.`;
    },
    matTimepickerMax: (error: MaxError<Date>) => {
      const formatted = formatDate(error.max, timeFormat, locale);
      return `Insira um horário menor ou igual a ${
        formatted ?? error.max
      }.`;
    },
  };
}

export const NGX_MAT_ERROR_CONFIG_PT_BR: FactoryProvider = {
  provide: NGX_MAT_ERROR_DEFAULT_OPTIONS,
  useFactory: errorMessagesPtBtFactory,
  deps: [LOCALE_ID],
};
