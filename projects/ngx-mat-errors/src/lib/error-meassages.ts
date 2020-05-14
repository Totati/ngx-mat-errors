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

export const DEFAULT_ERROR_MESSAGES: ErrorMessages = {
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
  matDatepickerMin: (error: MinError) =>
    `Please enter a date greater than or equal to ${error.min}.`,
  matDatepickerMax: (error: MaxError) =>
    `Please enter a date less than or equal to ${error.max}.`,
};
