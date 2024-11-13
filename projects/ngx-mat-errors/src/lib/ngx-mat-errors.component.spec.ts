import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { NgIf } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  Directive,
  Input,
  inject,
  type Provider,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatErrorHarness } from '@angular/material/form-field/testing';
import { MatInputModule } from '@angular/material/input';
import { MatInputHarness } from '@angular/material/input/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  NGX_MAT_ERROR_DEFAULT_OPTIONS,
  NgxMatErrors,
  NgxMatErrorsModule,
  type ErrorMessages,
} from 'ngx-mat-errors';
import { delay, from, interval, map, of, take, tap, zip } from 'rxjs';
import type { LengthError } from './types';

const defaultProviders: Provider[] = [
  {
    provide: NGX_MAT_ERROR_DEFAULT_OPTIONS,
    useValue: {
      required: 'required',
      minlength: (error: LengthError) =>
        `${error.actualLength} ${error.requiredLength}`,
      email: 'email',
    },
  },
];

const defaultImports = [
  ReactiveFormsModule,
  MatFormFieldModule,
  MatInputModule,
  NgxMatErrorsModule,
];

function createControl(value: string) {
  return new FormControl(value, [Validators.minLength(3), Validators.email]);
}

function updateControlValidators(control: FormControl) {
  control.setValidators([Validators.email, Validators.minLength(3)]);
  control.updateValueAndValidity();
}

describe('NgxMatErrors', () => {
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
    });
  });

  describe('out of MatFormField', () => {
    @Component({
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [...defaultImports, NgIf],
      providers: [...defaultProviders],
      template: `<mat-error ngx-mat-errors></mat-error>`,
    })
    class NgxMatErrorWithoutControl {}

    it('should not render anything when no control is connected', async () => {
      const fixture = TestBed.createComponent(NgxMatErrorWithoutControl);
      fixture.detectChanges();
      loader = TestbedHarnessEnvironment.loader(fixture);

      const matError = await loader.getHarness(MatErrorHarness);
      expect(await matError.getText()).toBe('');
    });

    @Component({
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [...defaultImports],
      providers: [...defaultProviders],
      template: `
        <mat-error [ngx-mat-errors]="input"></mat-error>
        <mat-form-field>
          <mat-label>Label</mat-label>
          <input matInput [formControl]="control" #input="matInput" />
        </mat-form-field>
      `,
    })
    class NgxMatErrorWithoutDefWithControl {
      control = createControl('12');
    }

    it('should render error control is connected manually', async () => {
      const fixture = TestBed.createComponent(NgxMatErrorWithoutDefWithControl);
      fixture.detectChanges();
      loader = TestbedHarnessEnvironment.loader(fixture);

      const matError = await loader.getHarness(MatErrorHarness);
      expect(await matError.getText()).toBe('2 3');
    });

    @Component({
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [...defaultImports, NgIf],
      providers: [...defaultProviders],
      template: `
        <mat-error
          [ngx-mat-errors]="isControlOneSelected ? input1 : input2"
        ></mat-error>
        <mat-form-field>
          <mat-label>Label</mat-label>
          <input matInput [formControl]="control1" #input1="matInput" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Label</mat-label>
          <input matInput [formControl]="control2" #input2="matInput" />
        </mat-form-field>
      `,
    })
    class NgxMatErrorWithControlChange {
      control1 = createControl('12');
      control2 = createControl('123');
      @Input()
      isControlOneSelected = true;
    }

    it('should handle control change', async () => {
      const fixture = TestBed.createComponent(NgxMatErrorWithControlChange);
      fixture.detectChanges();
      loader = TestbedHarnessEnvironment.loader(fixture);

      const matError = await loader.getHarness(MatErrorHarness);
      expect(await matError.getText()).toBe('2 3');

      fixture.componentRef.setInput('isControlOneSelected', false);
      fixture.detectChanges();

      expect(await matError.getText()).toBe('email');
    });

    @Component({
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [...defaultImports, NgIf],
      providers: [...defaultProviders],
      template: `
        <mat-error
          [ngx-mat-errors]="isControlOneSelected ? input1 : undefined"
        ></mat-error>
        <mat-form-field>
          <mat-label>Label</mat-label>
          <input matInput [formControl]="control1" #input1="matInput" />
        </mat-form-field>
      `,
    })
    class NgxMatErrorWithControlRemoved {
      control1 = createControl('12');
      @Input()
      isControlOneSelected = true;
    }

    it('should clear error when connected control is removed', async () => {
      const fixture = TestBed.createComponent(NgxMatErrorWithControlRemoved);
      fixture.detectChanges();
      loader = TestbedHarnessEnvironment.loader(fixture);

      const matError = await loader.getHarness(MatErrorHarness);
      expect(await matError.getText()).toBe('2 3');
      fixture.componentRef.setInput('isControlOneSelected', false);
      fixture.detectChanges();

      expect(await matError.getText()).toBe('');
    });
  });

  describe('with multiple controls', () => {
    @Component({
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [...defaultImports],
      providers: [...defaultProviders],
      template: `
        <mat-error [ngx-mat-errors]="[control1, control2]"></mat-error>
        <mat-error [ngx-mat-errors]="[control2, control1]"></mat-error>
      `,
    })
    class NgxMatErrorWithMultipleControls {
      control1 = createControl('12');
      control2 = createControl('123');
    }

    it('should render error from the first control', async () => {
      const fixture = TestBed.createComponent(NgxMatErrorWithMultipleControls);
      fixture.detectChanges();
      loader = TestbedHarnessEnvironment.loader(fixture);

      const [matError1, matError2] = await loader.getAllHarnesses(
        MatErrorHarness
      );
      expect(await matError1.getText()).toBe('2 3');
      expect(await matError2.getText()).toBe('email');

      const { control1, control2 } = fixture.componentInstance;

      control1.setValue('123');
      control2.setValue('12');

      expect(await matError1.getText()).toBe('email');
      expect(await matError2.getText()).toBe('2 3');

      control1.setValue('123@test.io');

      expect(await matError1.getText()).toBe('2 3');
      expect(await matError2.getText()).toBe('2 3');

      control2.setValue('123@test.io');

      expect(await matError1.getText()).toBe('');
      expect(await matError2.getText()).toBe('');
    });
  });

  describe('without ngxMatErrorDef', () => {
    @Component({
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [...defaultImports],
      providers: [...defaultProviders],
      template: `
        <mat-form-field>
          <mat-label>Label</mat-label>
          <input matInput [formControl]="control" />
          <mat-error ngx-mat-errors></mat-error>
        </mat-form-field>
      `,
    })
    class NgxMatErrorWithoutDef {
      control = createControl('12');
    }

    let fixture: ComponentFixture<NgxMatErrorWithoutDef>;
    beforeEach(() => {
      fixture = TestBed.createComponent(NgxMatErrorWithoutDef);
      fixture.detectChanges();
      loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should not display error message initially', async () => {
      const matError = await loader.getHarnessOrNull(MatErrorHarness);
      expect(matError).toBeNull();
    });

    it('should display only one error message when control is touched and invalid', async () => {
      const matInput = await loader.getHarness(MatInputHarness);
      await matInput.blur();
      const matErrors = await loader.getAllHarnesses(MatErrorHarness);
      expect(matErrors.length).toBe(1);
    });

    it('should call the error transform function', async () => {
      const matInput = await loader.getHarness(MatInputHarness);
      await matInput.blur();
      const matError = await loader.getHarness(MatErrorHarness);
      expect(await matError.getText()).toBe('2 3');
    });

    it('should display errors in the order of Validators', async () => {
      const matInput = await loader.getHarness(MatInputHarness);
      await matInput.blur();
      const matError = await loader.getHarness(MatErrorHarness);
      await matInput.setValue('asd');
      expect(await matError.getText()).toBe('email');

      updateControlValidators(fixture.componentInstance.control);
      await matInput.setValue('as');
      expect(await matError.getText()).toBe('email');
    });
  });

  describe('with ngxMatErrorDef', () => {
    @Component({
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [...defaultImports],
      providers: [...defaultProviders],
      template: `
        <mat-form-field>
          <mat-label>Label</mat-label>
          <input matInput [formControl]="control" />
          <mat-error ngx-mat-errors>
            <span *ngxMatErrorDef="let error; for: 'minlength'"
              >{{ error.actualLength }} {{ error.requiredLength }} def</span
            >
            <span *ngxMatErrorDef="let error; for: 'email'"> email def </span>
          </mat-error>
        </mat-form-field>
      `,
    })
    class NgxMatErrorsWithErrorDef {
      control = createControl('12');
    }

    let fixture: ComponentFixture<NgxMatErrorsWithErrorDef>;
    beforeEach(() => {
      fixture = TestBed.createComponent(NgxMatErrorsWithErrorDef);
      fixture.detectChanges();
      loader = TestbedHarnessEnvironment.loader(fixture);
    });
    it('should not display error message initially', async () => {
      const matError = await loader.getHarnessOrNull(MatErrorHarness);
      expect(matError).toBeNull();
    });

    it('should display only one error message when control is touched and invalid', async () => {
      const matInput = await loader.getHarness(MatInputHarness);
      await matInput.blur();
      const matErrors = await loader.getAllHarnesses(MatErrorHarness);
      expect(matErrors.length).toBe(1);
    });

    it('should display errors in the order of ngxMatErrorDef not the validators', async () => {
      const matInput = await loader.getHarness(MatInputHarness);
      await matInput.blur();

      const matError = await loader.getHarness(MatErrorHarness);
      expect(await matError.getText()).toBe('2 3 def');

      await matInput.setValue('asd');
      expect(await matError.getText()).toBe('email def');

      updateControlValidators(fixture.componentInstance.control);
      expect(await matError.getText()).toBe('email def');

      await matInput.setValue('as');
      expect(await matError.getText()).toBe('2 3 def');
    });

    @Component({
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [...defaultImports, NgIf],
      providers: [...defaultProviders],
      template: `
        <mat-form-field>
          <mat-label>Label</mat-label>
          <input matInput [formControl]="control" />
          <mat-error ngx-mat-errors>
            <ng-container *ngIf="isCustomMinLength1Visible">
              <span *ngxMatErrorDef="let error; for: 'minlength'"
                >minLength 1</span
              >
            </ng-container>
            <ng-container *ngIf="isCustomMinLength2Visible">
              <span *ngxMatErrorDef="let error; for: 'minlength'"
                >minLength 2</span
              >
            </ng-container>
          </mat-error>
        </mat-form-field>
      `,
    })
    class NgxMatErrorsWithErrorDefChange {
      control = createControl('12');
      @Input()
      isCustomMinLength1Visible = false;
      @Input()
      isCustomMinLength2Visible = false;
    }

    it('should handle ngxMatErrorDef change', async () => {
      const fixture = TestBed.createComponent(NgxMatErrorsWithErrorDefChange);
      fixture.detectChanges();
      loader = TestbedHarnessEnvironment.loader(fixture);

      const matInput = await loader.getHarness(MatInputHarness);
      await matInput.blur();

      const matError = await loader.getHarness(MatErrorHarness);
      expect(await matError.getText()).toBe('2 3');

      fixture.componentRef.setInput('isCustomMinLength2Visible', true);
      fixture.detectChanges();

      expect(await matError.getText()).toBe('minLength 2');

      fixture.componentRef.setInput('isCustomMinLength1Visible', true);
      fixture.detectChanges();

      expect(await matError.getText()).toBe('minLength 1');

      fixture.componentRef.setInput('isCustomMinLength1Visible', false);
      fixture.detectChanges();

      expect(await matError.getText()).toBe('minLength 2');
    });
  });

  describe('with async validator', () => {
    @Component({
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [...defaultImports],
      providers: [...defaultProviders],
      template: `
        <mat-form-field>
          <mat-label>Label</mat-label>
          <input matInput [formControl]="control" />
          <mat-error ngx-mat-errors></mat-error>
        </mat-form-field>
      `,
    })
    class NgxMatErrorWithAsyncValidator {
      control = new FormControl<string>('', {
        asyncValidators: [
          (control) =>
            of(Validators.minLength(3)(control)).pipe(
              delay(0),
              tap(console.log)
            ),
        ],
      });
    }

    it('should display errors of async validators', fakeAsync(async () => {
      const fixture = TestBed.createComponent(NgxMatErrorWithAsyncValidator);
      fixture.detectChanges();
      loader = TestbedHarnessEnvironment.loader(fixture);
      const matInput = await loader.getHarness(MatInputHarness);
      await matInput.blur();
      await matInput.setValue('a');
      tick(1);
      fixture.detectChanges();
      await fixture.whenRenderingDone();
      const matError = await loader.getHarness(MatErrorHarness);
      expect(await matError.getText()).toBe('1 3');
      await matInput.setValue('as');
      tick(1);
      fixture.detectChanges();
      expect(await matError.getText()).toBe('2 3');
    }));
  });

  describe('with observable messages', () => {
    @Component({
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [...defaultImports],
      providers: [
        {
          provide: NGX_MAT_ERROR_DEFAULT_OPTIONS,
          useValue: zip(
            from([
              {
                minlength: 'minlength1',
              },
              {
                minlength: 'minlength2',
              },
            ] as ErrorMessages[]),
            interval(1)
          ).pipe(
            take(2),
            map(([v]) => v)
          ),
        },
      ],
      template: `<mat-error [ngx-mat-errors]="control"></mat-error>`,
    })
    class NgxMatErrorWithObservableMessages {
      control = createControl('12');
    }

    it('should change message when new messages enter the stream', fakeAsync(async () => {
      const fixture = TestBed.createComponent(
        NgxMatErrorWithObservableMessages
      );
      fixture.detectChanges();
      loader = TestbedHarnessEnvironment.loader(fixture);
      const matError = await loader.getHarness(MatErrorHarness);
      expect(await matError.getText()).toBe('');
      tick(1);
      expect(await matError.getText()).toBe('minlength1');
      tick(1);
      expect(await matError.getText()).toBe('minlength2');
    }));
  });

  describe('with deprecated control change', () => {
    @Directive({
      // eslint-disable-next-line @angular-eslint/directive-selector
      selector: '[ngx-mat-errors][forTest]',
      standalone: true,
    })
    class NgxMatErrorsForTest implements AfterContentInit {
      private readonly ngxMatErrors = inject(NgxMatErrors);
      public ngAfterContentInit() {
        // Remove this whole describe block when the deprecated API is removed.
        this.ngxMatErrors.control = new FormControl(null, [
          Validators.required,
        ]);
      }
    }
    @Component({
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [...defaultImports, NgxMatErrorsForTest],
      providers: [...defaultProviders],
      template: `<mat-error ngx-mat-errors forTest></mat-error>`,
    })
    class NgxMatErrorWithDeprecatedControlSetting {}

    it('should be possible to set the control manually through deprecated API', async () => {
      const fixture = TestBed.createComponent(
        NgxMatErrorWithDeprecatedControlSetting
      );
      fixture.detectChanges();
      loader = TestbedHarnessEnvironment.loader(fixture);
      const matError = await loader.getHarness(MatErrorHarness);

      expect(await matError.getText()).toBe('required');
    });
  });
});
