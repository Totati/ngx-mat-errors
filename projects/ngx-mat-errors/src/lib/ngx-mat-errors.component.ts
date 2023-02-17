import { coerceArray } from '@angular/cdk/coercion';
import { AsyncPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Directive,
  InjectionToken,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  ValidationErrors,
} from '@angular/forms';
import {
  MAT_FORM_FIELD,
  MatFormFieldControl,
} from '@angular/material/form-field';
import { Observable, combineLatest, defer, of } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { ErrorMessages } from './error-messages';
import { getNgxMatErrorDefMissingForError } from './errors';

export type ErrorTemplate =
  | {
      template: TemplateRef<any>;
      $implicit: ValidationErrors;
    }
  | {
      template: undefined;
      $implicit: string;
    }
  | undefined;

export const NGX_MAT_ERROR_DEFAULT_OPTIONS = new InjectionToken<ErrorMessages>(
  'NGX_MAT_ERROR_DEFAULT_OPTIONS'
);

@Directive({
  selector: '[ngxMatErrorDef]',
  standalone: true,
})
export class NgxMatErrorDef implements OnInit, OnChanges {
  @Input() ngxMatErrorDefFor!: string;
  @Input() ngxMatErrorDefControl?:
    | AbstractControl
    | AbstractControl[]
    | string
    | string[];
  public readonly template = inject(TemplateRef);
  private readonly parentControl = inject(ControlContainer, {
    optional: true,
    skipSelf: true,
    host: true,
  });

  ngOnInit() {
    if (!this.ngxMatErrorDefFor) {
      throw getNgxMatErrorDefMissingForError();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {}
}

@Component({
  selector: 'ngx-mat-errors, [ngx-mat-errors]',
  template: `<ng-template #defaultTemplate let-error>{{ error }}</ng-template
    ><ng-template [ngIf]="error$ | async" let-error
      ><ng-template
        [ngTemplateOutlet]="error.template ?? defaultTemplate"
        [ngTemplateOutletContext]="error"
      ></ng-template>
    </ng-template>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, AsyncPipe, NgTemplateOutlet],
  host: {
    class: 'ngx-mat-errors',
  },
})
export class NgxMatErrors {
  private readonly messages = inject(NGX_MAT_ERROR_DEFAULT_OPTIONS);
  private readonly matFormField = inject(MAT_FORM_FIELD, { optional: true });

  @ContentChildren(NgxMatErrorDef, { descendants: true })
  private readonly customErrorMessages!: QueryList<NgxMatErrorDef>;

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('ngx-mat-errors')
  control?:
    | MatFormFieldControl<any>
    | AbstractControl
    | AbstractControl[]
    | null
    | '';

  protected readonly error$: Observable<ErrorTemplate> = defer(() => {
    const controls = getAbstractControls(
      this.control || this.matFormField?._control
    );
    if (!controls) {
      // TODO: Throw error;
      return of(undefined);
    }
    return combineLatest(
      controls.map((c) => c.valueChanges.pipe(startWith(c.value)))
    ).pipe(
      map(() => {
        const firstControlWithError = controls.find((c) => c.invalid);
        const errors = firstControlWithError?.errors;
        if (!errors) {
          return;
        }
        const errorKeys = Object.keys(errors);
        const errorOrErrorDef =
          this.customErrorMessages.find(
            ({ ngxMatErrorDefFor, ngxMatErrorDefControl }) =>
              errorKeys.some(
                (error) =>
                  error === ngxMatErrorDefFor &&
                  (!ngxMatErrorDefControl ||
                    coerceArray(ngxMatErrorDefControl).includes(
                      firstControlWithError
                    ))
              )
          ) ?? errorKeys.find((key) => key in this.messages);
        if (!errorOrErrorDef) {
          return;
        }
        if (errorOrErrorDef instanceof NgxMatErrorDef) {
          return {
            template: errorOrErrorDef.template,
            $implicit: errors[errorOrErrorDef.ngxMatErrorDefFor],
          };
        }
        const message = this.messages[errorOrErrorDef];
        return {
          $implicit:
            typeof message === 'function'
              ? message(errors[errorOrErrorDef])
              : message,
        };
      }),
      // this distincts only undefined values
      distinctUntilChanged()
    );
  });
}

function getAbstractControls(
  controls:
    | undefined
    | null
    | ''
    | AbstractControl[]
    | AbstractControl
    | MatFormFieldControl<any>
): AbstractControl[] | undefined {
  if (!controls) {
    return;
  }
  if (Array.isArray(controls)) {
    return controls;
  }
  const control =
    controls instanceof AbstractControl
      ? controls
      : controls.ngControl?.control;
  return control ? [control] : undefined;
}
