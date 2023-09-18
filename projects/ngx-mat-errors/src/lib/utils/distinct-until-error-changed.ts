import { ErrorTemplate } from '../types';

export function distinctUntilErrorChanged<P extends ErrorTemplate>(
  prev: P,
  curr: P
) {
  if (prev === curr) {
    return true;
  }
  if (!prev || !curr) {
    return false;
  }
  if (prev.template !== curr.template) {
    return false;
  }
  return prev.$implicit === curr.$implicit;
}
