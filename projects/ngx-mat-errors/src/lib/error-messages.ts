export type ErrorTransform = (error: any) => string;

export interface ErrorMessages {
  [key: string]: string | ErrorTransform;
}

export interface MinError {
  min: number;
  actual: number;
}

export interface MaxError {
  max: number;
  actual: number;
}

export interface LengthError {
  requiredLength: number;
  actualLength: number;
}

export interface PatternValidator {
  requiredPattern: string;
  actualValue: string;
}

export interface StartDateError {
  end: string | Date;
  actual: string | Date;
}
export interface EndDateError {
  actual: string | Date;
  start: string | Date;
}

export interface DatepickerParseError {
  text: string;
}

