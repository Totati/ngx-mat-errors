import { TemplateRef } from '@angular/core';
import { MaxError, MinError } from '../error-messages';
import { ErrorTemplate } from '../types';
import { distinctUntilErrorChanged } from './distinct-until-error-changed';

describe('distinctUntilErrorChanged', () => {
  const minError = {
    $implicit: 'min error',
    template: undefined,
  } as ErrorTemplate;
  const maxError = {
    $implicit: 'max error',
    template: undefined,
  } as ErrorTemplate;
  const minErrorTemplate = {
    $implicit: {
      actual: 2,
      min: 3,
    } satisfies MinError,
    template: {} as TemplateRef<any>,
  } as ErrorTemplate;
  const maxErrorTemplate = {
    $implicit: {
      actual: 3,
      max: 2,
    } satisfies MaxError,
    template: {} as TemplateRef<any>,
  } as ErrorTemplate;

  it('should return true if the value is the same', () => {
    expect(distinctUntilErrorChanged(undefined, undefined)).toBeTrue();
    expect(distinctUntilErrorChanged(minError, minError)).toBeTrue();
    expect(
      distinctUntilErrorChanged(minErrorTemplate, minErrorTemplate)
    ).toBeTrue();
  });

  it('should return false if undefined follows other values', () => {
    expect(distinctUntilErrorChanged(minError, undefined)).toBeFalse();
    expect(distinctUntilErrorChanged(minErrorTemplate, undefined)).toBeFalse();
  });

  it('should return false if other values follow undefined', () => {
    expect(distinctUntilErrorChanged(undefined, minError)).toBeFalse();
    expect(distinctUntilErrorChanged(undefined, minErrorTemplate)).toBeFalse();
  });

  it('should return false if different values follow each other', () => {
    expect(distinctUntilErrorChanged(minError, maxError)).toBeFalse();
    expect(distinctUntilErrorChanged(maxError, maxErrorTemplate)).toBeFalse();
    expect(
      distinctUntilErrorChanged(maxErrorTemplate, minErrorTemplate)
    ).toBeFalse();
    expect(distinctUntilErrorChanged(minErrorTemplate, minError)).toBeFalse();
  });
});
