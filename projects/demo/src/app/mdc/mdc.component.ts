import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { AbstractControl, AbstractControlDirective, FormControl, FormGroup, Validators } from '@angular/forms';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-mdc',
  templateUrl: './mdc.component.html',
  styleUrls: ['./mdc.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdcComponent {
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
    end: new FormControl<Date | null>(null, [Validators.required])
  })

  readonly minDate = new Date();

  value1: string | null = null;
  value2: number | null = null;
  value3: string | null = null;
  value4: Date | null = null;
  value5: Date | null = null;

  readonly outerErrorControl = new FormControl<number>(1);
  getControl(control1: AbstractControl | AbstractControlDirective, control2: AbstractControl | AbstractControlDirective) {
    switch (this.outerErrorControl.value) {
      case 2:
        return control1;
      case 3:
        return control2;
      default:
        return undefined;
    }
  }
}
