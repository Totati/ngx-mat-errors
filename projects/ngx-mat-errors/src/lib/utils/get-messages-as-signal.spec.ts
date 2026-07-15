import { isSignal, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { getMessagesAsSignal } from './get-messages-as-signal';

describe('getMessagesAsSignal', () => {
  it('should return a signal', () => {
    TestBed.runInInjectionContext(() => {
      expect(isSignal(getMessagesAsSignal({}))).toBeTrue();
      expect(isSignal(getMessagesAsSignal(of({})))).toBeTrue();
      expect(isSignal(getMessagesAsSignal(signal({})))).toBeTrue();
    });
  });
});
