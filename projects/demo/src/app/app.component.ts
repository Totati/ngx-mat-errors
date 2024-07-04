import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  AbstractControl,
  AbstractControlDirective,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import {
  NgxMatErrors,
  NgxMatErrorDef,
  NgxMatErrorsForDateRangePicker,
} from 'ngx-mat-errors';
import { AsyncMinLengthValidator } from './async-min-length-validator.directive';
import { of, delay } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
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
