import { AsyncPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Directive,
  InjectionToken,
  Input,
  OnInit,
  QueryList,
  TemplateRef,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import {
  MAT_FORM_FIELD,
  MatFormFieldControl,
} from '@angular/material/form-field';
import { Observable, defer, of } from 'rxjs';
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
export class NgxMatErrorDef implements OnInit {
  @Input() ngxMatErrorDefFor!: string;
  public readonly template = inject(TemplateRef);

  ngOnInit() {
    if (!this.ngxMatErrorDefFor) {
      throw getNgxMatErrorDefMissingForError();
    }
  }
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
  control?: MatFormFieldControl<any> | '' | null;

  protected readonly error$: Observable<ErrorTemplate> = defer(() => {
    const control = (this.control || this.matFormField?._control)?.ngControl
      ?.control;
    if (!control) {
      // TODO: Throw error;
      return of(undefined);
    }
    return control.valueChanges.pipe(
      startWith(null as any),
      map(() => {
        if (!control.errors) {
          return;
        }
        const errorKeys = Object.keys(control.errors);
        const errorOrErrorDef =
          this.customErrorMessages.find((customErrorMessage) =>
            errorKeys.some(
              (error) => error === customErrorMessage.ngxMatErrorDefFor
            )
          ) ?? errorKeys.find((key) => key in this.messages);
        if (!errorOrErrorDef) {
          return;
        }
        const errors = control.errors as ValidationErrors;
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
