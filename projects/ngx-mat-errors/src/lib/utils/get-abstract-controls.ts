import { coerceArray } from '@angular/cdk/coercion';
import { AbstractControl, AbstractControlDirective } from '@angular/forms';
import type { NgxMatErrorControls } from '../types';

export function getAbstractControls(
  controls: NgxMatErrorControls
): AbstractControl[] | undefined {
  if (!controls) {
    return;
  }
  const _controls = coerceArray(controls)
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
  return _controls.length ? _controls : undefined;
}
