import type { AbstractControl } from '@angular/forms';
import type { INgxMatErrorDef } from '../ngx-mat-error-def.directive';

/**
 * Find the custom error for a control.
 *
 * @returns INgxMatErrorDef | undefined
 */
export function findCustomErrorForControl(
  errorKeys: readonly string[],
  customErrorMessages: readonly INgxMatErrorDef[],
  control: AbstractControl
) {
  return customErrorMessages.find((customErrorMessage) =>
    errorKeys.some((error) => {
      if (error !== customErrorMessage.ngxMatErrorDefFor) {
        return false;
      }
      return (
        !customErrorMessage.control || customErrorMessage.control === control
      );
    })
  );
}
