import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDateRangeInputHarness } from '@angular/material/datepicker/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatErrorHarness } from '@angular/material/form-field/testing';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMatErrorDef } from './ngx-mat-error-def.directive';
import { NgxMatErrorsForDateRangePicker } from './ngx-mat-errors-for-date-range-picker.directive';
import {
  NGX_MAT_ERROR_DEFAULT_OPTIONS,
  NgxMatErrors,
} from './ngx-mat-errors.component';

describe('NgxMatErrorsForDateRangePicker', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
    });
  });
  @Component({
    template: `
      <mat-form-field>
        <mat-label>Label</mat-label>
        <mat-date-range-input [rangePicker]="dateRangePicker">
          <input matStartDate [formControl]="start" />
          <input matEndDate [formControl]="end" />
        </mat-date-range-input>
        <mat-date-range-picker #dateRangePicker></mat-date-range-picker>
        <mat-error ngx-mat-errors forDateRangePicker>
          <span *ngxMatErrorDef="let error; for: 'required', withControl: start">start</span>
          <span *ngxMatErrorDef="let error; for: 'required', withControl: end">end</span>
        </mat-error>
      </mat-form-field>
    `,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
      NgxMatErrors,
      NgxMatErrorsForDateRangePicker,
      NgxMatErrorDef,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatDatepickerModule,
      MatNativeDateModule,
    ],
    providers: [
      {
        provide: NGX_MAT_ERROR_DEFAULT_OPTIONS,
        useValue: { },
      },
    ],
  })
  class NgxMatErrorsForDateRangePickerComponent {
    readonly start = new FormControl(undefined, Validators.required);
    readonly end = new FormControl(undefined, Validators.required);
  }
  it('should assign controls of the MatDateRangePicker to ngx-mat-errors', async () => {
    const fixture = TestBed.createComponent(
      NgxMatErrorsForDateRangePickerComponent
    );
    fixture.detectChanges();
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const matDateRangeInputHarness = await loader.getHarness(
      MatDateRangeInputHarness
    );
    const startInput = await matDateRangeInputHarness.getStartInput();
    startInput.blur();
    const matError = await loader.getHarness(MatErrorHarness);

    expect(await matError.getText()).toBe('start');

    await startInput.setValue('2023-10-15');

    expect(await matError.getText()).toBe('end');

    const endInput = await matDateRangeInputHarness.getEndInput();
    await endInput.setValue('2023-10-15');

    expect(await matError.getText()).toBe('');

    await startInput.setValue('');

    expect(await matError.getText()).toBe('start');
  });
});
