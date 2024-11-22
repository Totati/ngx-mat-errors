import { Directive } from '@angular/core';
import type { MatDateRangeInput } from '@angular/material/datepicker';
import { NgxMatErrorControl } from './ngx-mat-error-control';

@Directive({
  selector: '[ngx-mat-errors][forDateRangePicker]',
  standalone: true,
  host: {
    class: 'ngx-mat-errors-for-date-range-picker',
  },
  providers: [
    {
      provide: NgxMatErrorControl,
      useExisting: NgxMatErrorsForDateRangePicker,
    },
  ],
})
export class NgxMatErrorsForDateRangePicker<D> extends NgxMatErrorControl {
  /** Returns start and end controls of the date range picker. */
  public override get() {
    const { _startInput, _endInput } = this.matFormField!
      ._control as MatDateRangeInput<D>;
    return [_startInput, _endInput];
  }
}
