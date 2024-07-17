import { type Observable, isObservable, of,  } from 'rxjs';
import type { ErrorMessages } from '../types';

export function coerceToObservable(
  errorMessages: ErrorMessages | Observable<ErrorMessages>
): Observable<ErrorMessages> {
  if (isObservable(errorMessages)) {
    return errorMessages;
  }
  return of(errorMessages);
}
