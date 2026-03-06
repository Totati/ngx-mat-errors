import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  InjectionToken,
  ViewEncapsulation,
  computed,
  contentChildren,
  inject,
  input,
  type Signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { type Observable } from 'rxjs';
import {
  NgxMatErrorControl,
  provideDefaultNgxMatErrorControl,
} from './ngx-mat-error-control';
import { NGX_MAT_ERROR_DEF } from './ngx-mat-error-def.directive';
import type {
  ErrorMessages,
  ErrorTemplate,
  NgxMatErrorControls,
} from './types';
import { distinctUntilErrorChanged } from './utils/distinct-until-error-changed';
import { findErrorForControl } from './utils/find-error-for-control';
import { getAbstractControls } from './utils/get-abstract-controls';
import { getControlWithError } from './utils/get-control-with-error';
import { getMessagesAsSignal } from './utils/get-messages-as-signal';

export const NGX_MAT_ERROR_DEFAULT_OPTIONS = new InjectionToken<
  ErrorMessages | Observable<ErrorMessages> | Signal<ErrorMessages>
>('NGX_MAT_ERROR_DEFAULT_OPTIONS');

@Component({
  selector: 'ngx-mat-errors, [ngx-mat-errors]',
  template: `<ng-template #defaultTemplate let-error>{{ error }}</ng-template>
    @if (error(); as error) {
      <ng-template
        [ngTemplateOutlet]="error.template ?? defaultTemplate"
        [ngTemplateOutletContext]="error"
      ></ng-template>
    }`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  host: {
    class: 'ngx-mat-errors',
  },
  providers: [provideDefaultNgxMatErrorControl()],
})
export class NgxMatErrors {
  private readonly messages = getMessagesAsSignal(
    inject(NGX_MAT_ERROR_DEFAULT_OPTIONS),
  );

  private readonly customErrorMessages = contentChildren(NGX_MAT_ERROR_DEF, {
    descendants: true,
  });

  private readonly defaultControl = inject(NgxMatErrorControl, {
    host: true,
  });

  public readonly control = input<NgxMatErrorControls>(undefined, {
    alias: 'ngx-mat-errors',
  });

  private readonly controlWithError = rxResource({
    params: () => ({
      control: this.control(),
      defaultControl: this.defaultControl.control(),
    }),
    stream: ({ params }) =>
      getControlWithError(
        getAbstractControls(params.control || params.defaultControl),
      ),
    // The latest control with error is always returned, even if it has the same error as the previous one, because the error object itself might have changed (e.g. new validation errors were set on the control).
    equal: (a, b) => a === b && !a,
  });

  protected readonly error = computed<ErrorTemplate>(
    () => {
      const controlWithError = this.controlWithError.value(),
        customErrorMessages = this.customErrorMessages(),
        messages = this.messages();
      if (!controlWithError) {
        return;
      }
      const errors = controlWithError.errors!,
        errorOrErrorDef = findErrorForControl(
          controlWithError,
          messages,
          customErrorMessages,
        );
      if (!errorOrErrorDef) {
        return;
      }
      if (typeof errorOrErrorDef === 'object') {
        return {
          template: errorOrErrorDef.template,
          $implicit: errors[errorOrErrorDef.ngxMatErrorDefFor],
        };
      }
      const message = messages[errorOrErrorDef];
      return {
        $implicit:
          typeof message === 'function'
            ? message(errors[errorOrErrorDef])
            : message,
      };
    },
    {
      equal: distinctUntilErrorChanged,
    },
  );
}
