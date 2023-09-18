import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { NgIf } from '@angular/common';
import { Component, Provider } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatErrorHarness } from '@angular/material/form-field/testing';
import { MatInputModule } from '@angular/material/input';
import { MatInputHarness } from '@angular/material/input/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  NGX_MAT_ERROR_DEFAULT_OPTIONS,
  NgxMatErrorsModule,
} from 'ngx-mat-errors';
import { LengthError } from './error-messages';
import { getNgxMatErrorDefMissingForError } from './errors';

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

function createControl(value = '12') {
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
      imports: [...defaultImports, NgIf],
      providers: [...defaultProviders],
      template: ` <mat-error ngx-mat-errors></mat-error> `,
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
      control = createControl();
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
      control1 = createControl();
      control2 = createControl('123');
      isControlOneSelected = true;
    }

    it('should handle control change', async () => {
      const fixture = TestBed.createComponent(NgxMatErrorWithControlChange);
      fixture.detectChanges();
      loader = TestbedHarnessEnvironment.loader(fixture);

      const matError = await loader.getHarness(MatErrorHarness);
      expect(await matError.getText()).toBe('2 3');

      fixture.componentInstance.isControlOneSelected = false;
      fixture.detectChanges();

      expect(await matError.getText()).toBe('email');
    });

    @Component({
      standalone: true,
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
      control1 = createControl();
      isControlOneSelected = true;
    }

    it('should clear error when connected control is removed', async () => {
      const fixture = TestBed.createComponent(NgxMatErrorWithControlRemoved);
      fixture.detectChanges();
      loader = TestbedHarnessEnvironment.loader(fixture);

      const matError = await loader.getHarness(MatErrorHarness);
      expect(await matError.getText()).toBe('2 3');

      fixture.componentInstance.isControlOneSelected = false;
      fixture.detectChanges();

      expect(await matError.getText()).toBe('');
    });
  });

  describe('without ngxMatErrorDef', () => {
    @Component({
      standalone: true,
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
      control = createControl();
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
      control = createControl();
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
      control = createControl();
      isCustomMinLength1Visible = false;
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

      fixture.componentInstance.isCustomMinLength2Visible = true;
      fixture.detectChanges();
      expect(await matError.getText()).toBe('minLength 2');

      fixture.componentInstance.isCustomMinLength1Visible = true;
      fixture.detectChanges();
      expect(await matError.getText()).toBe('minLength 1');

      fixture.componentInstance.isCustomMinLength1Visible = false;
      fixture.detectChanges();
      expect(await matError.getText()).toBe('minLength 2');
    });

    @Component({
      template: `<span *ngxMatErrorDef="let error">{{ error }}</span>`,
      standalone: true,
      imports: [NgxMatErrorsModule],
    })
    class NgxMatErrorsWithErrorDefShouldThrow {}

    it('should throw error when for is missing', () => {
      expect(() => {
        const fixture = TestBed.createComponent(
          NgxMatErrorsWithErrorDefShouldThrow
        );
        fixture.detectChanges();
      }).toThrowError(getNgxMatErrorDefMissingForError().message);
    });

    @Component({
      template: `<span *ngxMatErrorDef="let error; for: 'minlength'">{{
        error
      }}</span>`,
      standalone: true,
      imports: [NgxMatErrorsModule],
    })
    class NgxMatErrorsWithErrorDefShouldNotThrow {}

    it('should not throw error when for is present', () => {
      expect(() => {
        const fixture = TestBed.createComponent(
          NgxMatErrorsWithErrorDefShouldNotThrow
        );
        fixture.detectChanges();
      }).not.toThrow();
    });
  });
});
