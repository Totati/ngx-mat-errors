import { Observable, isObservable, of,  } from 'rxjs';
import type { ErrorMessages } from '../error-messages';

export function coerceToObservable(
  errorMessages: ErrorMessages | Observable<ErrorMessages>
): Observable<ErrorMessages> {
  if (isObservable(errorMessages)) {
    return errorMessages;
  }
  return of(errorMessages);
}
