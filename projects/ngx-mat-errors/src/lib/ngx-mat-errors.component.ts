import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Directive,
  Inject,
  InjectionToken,
  Input,
  OnInit,
  Optional,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import {
  MatFormField,
  MatFormFieldControl,
  MAT_FORM_FIELD,
} from '@angular/material/form-field';
import { defer } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { DEFAULT_ERROR_MESSAGES, ErrorMessages } from './error-meassages';
import { getNgxMatErrorDefMissingForError } from './errors';

export const NGX_MAT_ERROR_DEFAULT_OPTIONS = new InjectionToken<ErrorMessages>(
  'NGX_MAT_ERROR_DEFAULT_OPTIONS'
);

export interface ErrorOutletContext<T> {
  $implicit?: T;
}

@Directive({
  selector: '[ngxMatErrorDef]',
  standalone: true,
})
export class NgxMatErrorDef implements OnInit {
  @Input() ngxMatErrorDefFor!: string;
  constructor(public template: TemplateRef<any>) {}

  ngOnInit() {
    if (!this.ngxMatErrorDefFor) {
      throw getNgxMatErrorDefMissingForError();
    }
  }
}

@Directive({
  selector: '[ngxMatErrorOutlet]',
  standalone: true,
})
export class NgxMatErrorOutlet {
  constructor(public readonly viewContainer: ViewContainerRef) {}
}

@Component({
  selector: 'ngx-mat-errors, [ngx-mat-errors]',
  template: `{{ error$ | async
    }}<ng-container ngxMatErrorOutlet></ng-container>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, NgxMatErrorOutlet],
  host: {
    class: 'ngx-mat-errors',
  },
})
export class NgxMatErrors<T> {
  private readonly messages: ErrorMessages;
  private readonly messageKeys: Set<string>;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('ngx-mat-errors')
  control?: MatFormFieldControl<any> | '' | null;

  @ViewChild(NgxMatErrorOutlet, { static: true })
  readonly errorOutlet!: NgxMatErrorOutlet;

  @ContentChildren(NgxMatErrorDef, { descendants: true })
  readonly customErrorMessages!: QueryList<NgxMatErrorDef>;

  constructor(
    private readonly cdRef: ChangeDetectorRef,
    @Optional()
    @Inject(NGX_MAT_ERROR_DEFAULT_OPTIONS)
    messages: ErrorMessages | null,
    @Optional()
    @Inject(MAT_FORM_FIELD)
    private readonly matFormField: MatFormField
  ) {
    this.messages = messages || DEFAULT_ERROR_MESSAGES;
    this.messageKeys = new Set(Object.keys(this.messages));
  }

  readonly error$ = defer(() => {
    if (!this.control && this.matFormField) {
      this.control = this.matFormField._control;
    }
    if (!this.control) {
      return '';
    }
    const control = this.control.ngControl?.control;
    if (!control) {
      // TODO: Throw error;
      return '';
    }
    return this.initError(control);
  });

  private initError(control: AbstractControl<any, any>) {
    return control.valueChanges.pipe(
      startWith(null as any),
      map(() => {
        this.errorOutlet.viewContainer.clear();
        if (!control.errors) {
          return '';
        }
        const errorKeys = Object.keys(control.errors);
        const customErrorMessage = this._getCustomErrorMessage(errorKeys);
        const errorOrErrorDef =
          customErrorMessage ??
          errorKeys.find((key) => this.messageKeys.has(key));
        if (!errorOrErrorDef) {
          return '';
        }
        const errors = control.errors as ValidationErrors;
        if (errorOrErrorDef instanceof NgxMatErrorDef) {
          this._populateErrorOutlet(errorOrErrorDef, errors);
          return '';
        }
        const message = this.messages[errorOrErrorDef];
        if (typeof message === 'function') {
          return message(errors[errorOrErrorDef]);
        }
        return message;
      }),
      distinctUntilChanged()
    );
  }

  private _populateErrorOutlet(
    errorDef: NgxMatErrorDef,
    errors: ValidationErrors
  ) {
    const context: ErrorOutletContext<T> = {
      $implicit: errors[errorDef.ngxMatErrorDefFor],
    };
    this.errorOutlet.viewContainer.createEmbeddedView(
      errorDef.template,
      context
    );
    this.cdRef.markForCheck();
  }

  private _getCustomErrorMessage(errors: string[]): NgxMatErrorDef | undefined {
    return this.customErrorMessages.find((customErrorMessage) =>
      errors.some((error) => error === customErrorMessage.ngxMatErrorDefFor)
    );
  }
}
