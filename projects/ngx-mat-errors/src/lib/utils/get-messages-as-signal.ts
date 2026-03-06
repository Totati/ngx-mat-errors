import { isSignal, signal, type Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { isObservable, type Observable } from 'rxjs';
import type { ErrorMessages } from '../types';

export function getMessagesAsSignal(
  errorMessages:
    | ErrorMessages
    | Observable<ErrorMessages>
    | Signal<ErrorMessages>,
): Signal<ErrorMessages> {
  if (isObservable(errorMessages)) {
    return toSignal(errorMessages, { requireSync: true });
  }
  if (isSignal(errorMessages)) {
    return errorMessages;
  }
  return signal(errorMessages);
}
