import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  readonly control1 = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9]{0,2}'),
  ]);
  readonly control2 = new FormControl('', [
    Validators.min(10),
    Validators.max(20),
  ]);
}
