import type { AbstractControl } from '@angular/forms';
import {
  type Observable,
  pairwise,
  filter,
  merge,
  startWith,
  map,
  combineLatest,
} from 'rxjs';

export function getControlWithError(
  controls: AbstractControl[]
): Observable<AbstractControl | undefined> {
  const controlChanges = controls.map((control) => {
    const fromPendingStates = control.statusChanges.pipe(
      pairwise(),
      filter(([previous, current]) => {
        return previous === 'PENDING' && current !== 'PENDING';
      })
    );

    return merge(control.valueChanges, fromPendingStates).pipe(
      startWith(null as any),
      map(() => control)
    );
  });
  return combineLatest(controlChanges).pipe(
    map((control) => control.find((control) => !!control.errors))
  );
}
