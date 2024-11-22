import type { TemplateRef } from '@angular/core';
import type {
  AbstractControl,
  AbstractControlDirective,
  ValidationErrors,
} from '@angular/forms';
import type { MatFormFieldControl } from '@angular/material/form-field';

export type ErrorTemplate =
  | {
      template: TemplateRef<any>;
      $implicit: ValidationErrors;
    }
  | {
      template: undefined;
      $implicit: string;
    }
  | undefined;

export type FormFieldControl = Pick<MatFormFieldControl<any>, 'ngControl'>;

export type NgxMatErrorControls =
  | FormFieldControl
  | AbstractControl
  | AbstractControlDirective
  | (FormFieldControl | AbstractControl | AbstractControlDirective)[]
  | undefined
  | null
  | '';

export type ErrorTransform = (error: any) => string;

export interface ErrorMessages {
  [key: string]: string | ErrorTransform;
}

/**
 * For errors: 'min', 'matDatepickerMin'
 */
export interface MinError<T = number> {
  min: T;
  actual: T;
}

/**
 * For errors: 'max', 'matDatepickerMax'
 */
export interface MaxError<T = number> {
  max: T;
  actual: T;
}

/**
 * For errors: 'minlength', 'maxlength'
 */
export interface LengthError {
  requiredLength: number;
  actualLength: number;
}

/**
 * For errors: 'pattern'
 */
export interface PatternValidator {
  requiredPattern: string;
  actualValue: string;
}

/**
 * For errors: 'matStartDateInvalid'
 */
export interface StartDateError<D> {
  end: D;
  actual: D;
}

/**
 * For errors: 'matEndDateInvalid'
 */
export interface EndDateError<D> {
  start: D;
  actual: D;
}

/**
 * For errors: 'matDatepickerParse', 'matTimepickerParse'
 */
export interface ParseError {
  text: string;
}
/**
 * @deprecated to be removed in version 20. Please use ParseError instead
 */
export type DatepickerParseError = ParseError;
