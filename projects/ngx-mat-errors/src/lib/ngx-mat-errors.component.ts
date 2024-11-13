import { AsyncPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  InjectionToken,
  Input,
  ViewEncapsulation,
  inject,
  type OnDestroy,
  type QueryList,
} from '@angular/core';
import {
  ReplaySubject,
  combineLatest,
  distinctUntilChanged,
  map,
  of,
  startWith,
  switchMap,
  type Observable,
} from 'rxjs';
import { NgxMatErrorControl } from './ngx-mat-error-control';
import {
  NGX_MAT_ERROR_DEF,
  type INgxMatErrorDef,
} from './ngx-mat-error-def.directive';
import type {
  ErrorMessages,
  ErrorTemplate,
  NgxMatErrorControls,
} from './types';
import { coerceToObservable } from './utils/coerce-to-observable';
import { distinctUntilErrorChanged } from './utils/distinct-until-error-changed';
import { findCustomErrorForControl as findErrorForControl } from './utils/find-error-for-control';
import { getAbstractControls } from './utils/get-abstract-controls';
import { getControlWithError } from './utils/get-control-with-error';

export const NGX_MAT_ERROR_DEFAULT_OPTIONS = new InjectionToken<
  ErrorMessages | Observable<ErrorMessages>
>('NGX_MAT_ERROR_DEFAULT_OPTIONS');

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
  providers: [
    {
      provide: NgxMatErrorControl,
      useClass: NgxMatErrorControl,
    },
  ],
})
export class NgxMatErrors implements OnDestroy {
  private readonly messages$ = coerceToObservable(
    inject(NGX_MAT_ERROR_DEFAULT_OPTIONS)
  );
  private readonly defaultControl = inject(NgxMatErrorControl, {
    host: true,
  });
  private readonly controlChangedSubject =
    new ReplaySubject<NgxMatErrorControls>(1);

  protected error$!: Observable<ErrorTemplate>;

  // ContentChildren is set before ngAfterContentInit which is before ngAfterViewInit.
  // Before ngAfterViewInit lifecycle hook we can modify the error$ observable without needing another change detection cycle.
  // This elaborates the need of rxjs defer;
  @ContentChildren(NGX_MAT_ERROR_DEF, { descendants: true })
  protected set customErrorMessages(queryList: QueryList<INgxMatErrorDef>) {
    const firstControlWithError$ = this.controlChangedSubject.pipe(
        switchMap((_controls) => {
          const controls = getAbstractControls(
            _controls || this.defaultControl.get()
          );
          if (!controls) {
            return of(null);
          }
          return getControlWithError(controls);
        })
      ),
      customErrorMessages$ = (
        queryList.changes as Observable<QueryList<INgxMatErrorDef>>
      ).pipe(startWith(queryList));
    this.error$ = combineLatest([
      firstControlWithError$,
      customErrorMessages$,
      this.messages$,
    ]).pipe(
      map(([controlWithError, customErrorMessages, messages]) => {
        if (!controlWithError) {
          return;
        }
        const errors = controlWithError.errors!,
          errorOrErrorDef = findErrorForControl(
            controlWithError,
            messages,
            customErrorMessages.toArray()
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
      }),
      distinctUntilChanged(distinctUntilErrorChanged)
    );
  }

  // eslint-disable-next-line @angular-eslint/no-input-rename
  /**
   * @deprecated will be changed to a signal and it won't be possible to set the property from TS.
   * Instead of setting it in a directive, the directive should extend the {@link NgxMatErrorControl } class
   * and provide itself as it.
   */
  @Input('ngx-mat-errors')
  public set control(control: NgxMatErrorControls) {
    this.controlChangedSubject.next(control);
  }

  /** @ignore */
  public ngOnDestroy(): void {
    this.controlChangedSubject.complete();
  }
}
