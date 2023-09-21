import { Directive } from '@angular/core';
import {
  NG_ASYNC_VALIDATORS,
  AsyncValidator,
  AbstractControl,
  ValidationErrors,
  MinLengthValidator,
} from '@angular/forms';
import { Observable, delay, of } from 'rxjs';

@Directive({
  selector: '[appAsyncMinLengthValidator]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: AsyncMinLengthValidator,
      multi: true,
    },
  ],
  standalone: true,
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['minlength: appAsyncMinLengthValidator'],
})
export class AsyncMinLengthValidator
  extends MinLengthValidator
  implements AsyncValidator
{
  override validate(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    return of(super.validate(control)).pipe(delay(400));
  }
}
