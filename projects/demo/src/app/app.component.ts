import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractControl,
  AbstractControlDirective,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  NgxMatErrorDef,
  NgxMatErrors,
  NgxMatErrorsForDateRangePicker,
} from 'ngx-mat-errors';
import { delay, of } from 'rxjs';
import { AsyncMinLengthValidator } from './async-min-length-validator.directive';

@Component({
  selector: 'body',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMatErrors,
    NgxMatErrorDef,
    MatCardModule,
    MatRadioModule,
    MatToolbarModule,
    ReactiveFormsModule,
    FormsModule,
    AsyncMinLengthValidator,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTimepickerModule,
    NgxMatErrorsForDateRangePicker,
  ],
})
export class AppComponent {
  readonly control1 = new FormControl<string>('', [
    Validators.required,
    Validators.pattern('[0-9]{0,2}'),
  ]);
  readonly control2 = new FormControl<number | null>(null, [
    Validators.min(10),
    Validators.max(20),
  ]);
  readonly control3 = new FormControl<string>('', {
    asyncValidators: [
      (control) => of(Validators.minLength(3)(control)).pipe(delay(250)),
    ],
  });
  readonly time = new FormControl<Date | null>(new Date('2024-11-22 12:30'));

  readonly dateRange = new FormGroup({
    start: new FormControl<Date | null>(null, [Validators.required]),
    end: new FormControl<Date | null>(null, [Validators.required]),
  });

  readonly minDate = new Date();

  value1: string | null = null;
  value2: number | null = null;
  value3: string | null = null;
  value4: Date | null = null;
  value5: Date | null = null;
  value6: Date | null = null;

  readonly outerErrorControl = new FormControl<string | null>(null);
  getControl(
    control1: AbstractControl | AbstractControlDirective,
    control2: AbstractControl | AbstractControlDirective
  ) {
    switch (this.outerErrorControl.value) {
      case '1':
        return control1;
      case '2':
        return control2;
      default:
        return undefined;
    }
  }
}
