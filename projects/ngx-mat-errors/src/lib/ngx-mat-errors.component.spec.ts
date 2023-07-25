import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
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
import { LengthError } from './error-meassages';
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

function createControl() {
  return new FormControl('12', [Validators.minLength(3), Validators.email]);
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
  });
});
