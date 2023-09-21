import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatInput } from '@angular/material/input';
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

  value1: string | null = null;
  value2: number | null = null;
  value3: string | null = null;

  readonly outerErrorControl = new FormControl<number>(1);
  getMatInput(matInput1: MatInput, matInput2: MatInput) {
    switch (this.outerErrorControl.value) {
      case 2:
        return matInput1;
      case 3:
        return matInput2;
      default:
        return undefined;
    }
  }
}
