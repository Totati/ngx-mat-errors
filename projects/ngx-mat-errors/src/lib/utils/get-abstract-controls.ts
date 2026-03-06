import { coerceArray } from '@angular/cdk/coercion';
import { AbstractControl, AbstractControlDirective } from '@angular/forms';
import type { NgxMatErrorControls } from '../types';

export function getAbstractControls(
  controls: NgxMatErrorControls
): AbstractControl[] {
  if (!controls) {
    return [];
  }
  return coerceArray(controls)
    .map((control) =>
      !control
        ? undefined
        : control instanceof AbstractControlDirective
        ? control.control
        : control instanceof AbstractControl
        ? control
        : control.ngControl?.control
    )
    .filter(<T>(control: T): control is NonNullable<T> => control != null);
}
