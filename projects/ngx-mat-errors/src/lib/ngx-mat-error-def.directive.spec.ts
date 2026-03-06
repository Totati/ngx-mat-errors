import {
  ChangeDetectionStrategy,
  Component,
  provideZonelessChangeDetection,
  ViewChild,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgxMatErrorDef } from './ngx-mat-error-def.directive';

describe('NgxMatErrorDef', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  describe('withControl', () => {
    @Component({
      template: `<form [formGroup]="fg">
        <span
          *ngxMatErrorDef="let error; for: 'minlength'; withControl: 'input'"
        ></span>
      </form>`,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [NgxMatErrorDef, ReactiveFormsModule],
    })
    class NgxMatErrorsWithErrorDefWithControlOfString {
      @ViewChild(NgxMatErrorDef, { static: true })
      readonly ngxMatErrorDef!: NgxMatErrorDef;

      readonly fg = new FormGroup({
        input: new FormControl(''),
      });
    }

    it('should get the control when withControl is string', async () => {
      const fixture = TestBed.createComponent(
        NgxMatErrorsWithErrorDefWithControlOfString,
      );
      await fixture.whenStable();
      const { fg, ngxMatErrorDef } = fixture.componentInstance;
      expect(fg.controls.input).toEqual(ngxMatErrorDef.control as FormControl);
    });

    @Component({
      template: `<input [(ngModel)]="input" #inputControl="ngModel" />
        <span
          *ngxMatErrorDef="
            let error;
            for: 'minlength';
            withControl: inputControl
          "
        ></span>`,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [NgxMatErrorDef, FormsModule],
    })
    class NgxMatErrorsWithErrorDefWithControlOfNgModel {
      @ViewChild(NgxMatErrorDef, { static: true })
      readonly ngxMatErrorDef!: NgxMatErrorDef;
      public input = '';
    }

    it('should get the control when withControl is NgModel', async () => {
      const fixture = TestBed.createComponent(
        NgxMatErrorsWithErrorDefWithControlOfNgModel,
      );
      await fixture.whenStable();
      expect(fixture.componentInstance.ngxMatErrorDef.control).toBeDefined();
    });
  });
});
