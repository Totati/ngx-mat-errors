import { type AfterContentInit, Directive, inject } from '@angular/core';
import type { MatDateRangeInput } from '@angular/material/datepicker';
import { MAT_FORM_FIELD } from '@angular/material/form-field';
import { NgxMatErrors } from './ngx-mat-errors.component';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[ngx-mat-errors][forDateRangePicker]',
  standalone: true,
  host: {
    class: 'ngx-mat-errors-for-date-range-picker',
  },
})
export class NgxMatErrorsForDateRangePicker<D> implements AfterContentInit {
  private readonly ngxMatErrors = inject(NgxMatErrors);
  private readonly matFormField = inject(MAT_FORM_FIELD);
  public ngAfterContentInit() {
    const control = this.matFormField._control as MatDateRangeInput<D>;
    this.ngxMatErrors.control = [
      control._startInput.ngControl,
      control._endInput.ngControl,
    ];
  }
}
