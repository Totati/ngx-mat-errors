/** @docs-private */
export function getNgxMatErrorDefMissingForError(): Error {
  return Error(
    `'for' must be set for ngxMatErrorDef. See example: *ngxMatErrorDef="let error; for: 'pattern'`
  );
}
