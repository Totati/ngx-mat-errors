import { type AbstractControl } from '@angular/forms';
import { type INgxMatErrorDef } from '../ngx-mat-error-def.directive';

/**
 * Find the custom error for a control.
 *
 * @returns INgxMatErrorDef | undefined
 */
export function findCustomErrorForControl(
  errorKeys: string[],
  customErrorMessages: INgxMatErrorDef[],
  control: AbstractControl
) {
  return customErrorMessages.find((customErrorMessage) => {
    return errorKeys.some((error) => {
      if (error !== customErrorMessage.ngxMatErrorDefFor) return false;
      return (
        !customErrorMessage.control || customErrorMessage.control === control
      );
    });
  });
}
