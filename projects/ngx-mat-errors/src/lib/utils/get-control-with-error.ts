import {
  StatusChangeEvent,
  ValueChangeEvent,
  type AbstractControl,
} from '@angular/forms';
import { combineLatest, filter, map, startWith, type Observable } from 'rxjs';

export function getControlWithError(
  controls: AbstractControl[]
): Observable<AbstractControl | undefined> {
  const controlChanges = controls.map((control) =>
    control.events.pipe(
      filter(
        (event) =>
          event instanceof StatusChangeEvent ||
          event instanceof ValueChangeEvent
      ),
      startWith(null as any),
      map(() => control)
    )
  );
  return combineLatest(controlChanges).pipe(
    map((control) => control.find((control) => !!control.errors))
  );
}
