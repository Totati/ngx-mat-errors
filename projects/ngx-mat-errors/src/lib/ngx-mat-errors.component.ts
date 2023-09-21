import { AsyncPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Directive,
  InjectionToken,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  TemplateRef,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import {
  MAT_FORM_FIELD,
  MatFormFieldControl,
} from '@angular/material/form-field';
import { Observable, ReplaySubject, combineLatest, merge, of } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  pairwise,
  startWith,
  switchMap,
} from 'rxjs/operators';
import { ErrorMessages } from './error-messages';
import { getNgxMatErrorDefMissingForError } from './errors';
import { ErrorTemplate } from './types';
import { distinctUntilErrorChanged } from './utils/distinct-until-error-changed';

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
export class NgxMatErrors implements OnDestroy {
  private readonly messages = inject(NGX_MAT_ERROR_DEFAULT_OPTIONS);
  private readonly matFormField = inject(MAT_FORM_FIELD, { optional: true });
  private readonly controlChangedSubject = new ReplaySubject<
    MatFormFieldControl<any> | '' | null | undefined
  >(1);

  protected error$!: Observable<ErrorTemplate>;

  // ContentChildren is set before ngAfterContentInit which is before ngAfterViewInit.
  // Before ngAfterViewInit lifecycle hook we can modify the error$ observable without needing another change detection cycle.
  // This elaborates the need of rxjs defer;
  @ContentChildren(NgxMatErrorDef, { descendants: true })
  protected set customErrorMessages(queryList: QueryList<NgxMatErrorDef>) {
    const errors$ = this.controlChangedSubject.pipe(
        switchMap((_control) => {
          const control = (_control || this.matFormField?._control)?.ngControl
            ?.control;
          if (!control) {
            return of(null);
          }

          const fromPendingStates = control.statusChanges.pipe(
            pairwise(),
            filter(([previous, current]) => {
              return previous === 'PENDING' && current !== 'PENDING';
            })
          );

          return merge(control.valueChanges, fromPendingStates).pipe(
            startWith(null as any),
            map(() => control.errors)
          );
        })
      ),
      customErrorMessage$ = (
        queryList.changes as Observable<QueryList<NgxMatErrorDef>>
      ).pipe(startWith(queryList));

    this.error$ = combineLatest([errors$, customErrorMessage$]).pipe(
      map(([errors, customErrorMessage]) => {
        if (!errors) {
          return;
        }
        const errorKeys = Object.keys(errors);
        const errorOrErrorDef =
          customErrorMessage.find((customErrorMessage) =>
            errorKeys.some(
              (error) => error === customErrorMessage.ngxMatErrorDefFor
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
      distinctUntilChanged(distinctUntilErrorChanged)
    );
  }

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('ngx-mat-errors')
  set control(control: MatFormFieldControl<any> | '' | null | undefined) {
    this.controlChangedSubject.next(control);
  }

  ngOnDestroy(): void {
    this.controlChangedSubject.complete();
  }
}
