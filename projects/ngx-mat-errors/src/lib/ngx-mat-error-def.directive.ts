import {
  Directive,
  InjectionToken,
  Input,
  TemplateRef,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  type AbstractControlDirective,
} from '@angular/forms';

export interface INgxMatErrorDef {
  ngxMatErrorDefFor: string;
  ngxMatErrorDefWithControl?:
    | AbstractControlDirective
    | AbstractControl
    | string
    | null;
  template: TemplateRef<any>;
  control?: AbstractControl;
}

export const NGX_MAT_ERROR_DEF = new InjectionToken<INgxMatErrorDef>(
  'NGX_MAT_ERROR_DEF'
);

@Directive({
  selector: '[ngxMatErrorDef]',
  standalone: true,
  providers: [
    {
      provide: NGX_MAT_ERROR_DEF,
      useExisting: NgxMatErrorDef,
    },
  ],
})
export class NgxMatErrorDef implements INgxMatErrorDef {
  /**
   * Specify the error key to be used for error matching.
   * @required
   */
  @Input({
    required: true,
  })
  public ngxMatErrorDefFor!: string;

  /**
   * Specify the control to be used for error matching.
   * @optional
   */
  @Input()
  public ngxMatErrorDefWithControl?:
    | AbstractControlDirective
    | AbstractControl
    | string
    | null = undefined;
  public readonly template = inject(TemplateRef);
  private readonly controlContainer = inject(ControlContainer, {
    optional: true,
    skipSelf: true,
  });

  public get control(): AbstractControl | undefined {
    const input = this.ngxMatErrorDefWithControl;
    if (typeof input === 'string') {
      return this.controlContainer?.control?.get(input) ?? undefined;
    }
    if (input instanceof AbstractControl) {
      return input;
    }
    return input?.control ?? undefined;
  }
}
