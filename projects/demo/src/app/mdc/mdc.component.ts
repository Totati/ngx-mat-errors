import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  readonly start = new FormControl<Date | null>(null, Validators.required);
  readonly end = new FormControl<Date | null>(null, Validators.required);

  filter = () => false;

  value1: string | null = null;
  value2: number | null = null;
}
