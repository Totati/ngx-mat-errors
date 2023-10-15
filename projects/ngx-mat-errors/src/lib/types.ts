import { TemplateRef } from '@angular/core';
import {
  AbstractControl,
  AbstractControlDirective,
  ValidationErrors,
} from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';

export type ErrorTemplate =
  | {
      template: TemplateRef<any>;
      $implicit: ValidationErrors;
      control?: AbstractControlDirective | AbstractControl;
    }
  | {
      template: undefined;
      $implicit: string;
    }
  | undefined;

export type NgxMatErrorControls =
  | MatFormFieldControl<any>
  | AbstractControl
  | (AbstractControl | AbstractControlDirective)[]
  | AbstractControlDirective
  | undefined
  | null
  | '';
