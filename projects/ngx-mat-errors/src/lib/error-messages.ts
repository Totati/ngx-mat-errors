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
 * For errors: 'matDatepickerParse'
 */
export interface DatepickerParseError {
  text: string;
}
