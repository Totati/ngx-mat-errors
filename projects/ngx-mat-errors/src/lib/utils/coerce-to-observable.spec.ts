import { isObservable, of } from 'rxjs';
import { coerceToObservable } from './coerce-to-observable';

describe('coerceToObservable', () => {
  it('should return observable', () => {
    expect(isObservable(coerceToObservable({}))).toBeTrue();
    expect(isObservable(coerceToObservable(of({})))).toBeTrue();
  });
});
