# NgxMatErrors

[![npm version](https://img.shields.io/npm/v/ngx-mat-errors.svg?style=flat-square)](https://www.npmjs.com/package/ngx-mat-errors)
[![npm downloads total](https://img.shields.io/npm/dt/ngx-mat-errors.svg?style=flat-square)](https://www.npmjs.com/package/ngx-mat-errors)
[![npm downloads monthly](https://img.shields.io/npm/dm/ngx-mat-errors.svg?style=flat-square)](https://www.npmjs.com/package/ngx-mat-errors)

## What Does It Do?

NgxMatErrors provides an easy yet flexible solution for displaying error messages in a `MatFormField`.

## Try It

See it in action on [StackBlitz](https://stackblitz.com/edit/ngx-mat-errors-angular-17?file=src%2Fapp%2Fapp.component.html).

## How to Use It

Install `ngx-mat-errors` in your project:

```sh
npm install ngx-mat-errors
```

Import `NgxMatErrorsModule` and provide `NGX_MAT_ERROR_CONFIG_EN` (or your custom error messages) in your `app.module.ts`.

```typescript
import { NgxMatErrorsModule, NGX_MAT_ERROR_CONFIG_EN } from "ngx-mat-errors";

@NgModule({
  imports: [
    ...,
    NgxMatErrorsModule
  ],
  providers: [NGX_MAT_ERROR_CONFIG_EN],
})
export class AppModule {}
```

Or you can import only `NgxMatErrors` and `NgxMatErrorDef` as they are marked standalone.

```typescript
import { NgxMatErrors, NgxMatErrorDef, NGX_MAT_ERROR_CONFIG_EN } from "ngx-mat-errors";

@NgModule({
  imports: [
    ...,
    NgxMatErrors,
    NgxMatErrorDef
  ],
  providers: [NGX_MAT_ERROR_CONFIG_EN],
})
export class AppModule {}
```

Add `[ngx-mat-errors]` to your `mat-error` in your `mat-form-field`.

```html
<mat-form-field>
  <mat-label>Label</mat-label>
  <input type="text" matInput [formControl]="control" />
  <mat-error ngx-mat-errors></mat-error>
</mat-form-field>
```

### Outside a `MatFormField` or Override the Control

`ngx-mat-errors` can be used as an `@Input()` to assign a control manually.

#### Reactive Forms

```html
<mat-form-field>
  <mat-label>Label</mat-label>
  <input type="text" matInput [formControl]="control" autocomplete="off" />
</mat-form-field>
<mat-error [ngx-mat-errors]="control"></mat-error>
```

#### Template-Driven Forms

```html
<mat-form-field>
  <mat-label>Label</mat-label>
  <input type="text" matInput #control="ngModel" [(ngModel)]="input" autocomplete="off" />
</mat-form-field>
<mat-error [ngx-mat-errors]="control"></mat-error>
```

### Multiple Controls

It can display errors for multiple controls, one at a time. The order of the controls is important; the first control with an error will be displayed.

```html
<mat-form-field>
  <mat-label>Label</mat-label>
  <mat-date-range-input [rangePicker]="dateRangePicker">
    <input matStartDate [formControl]="startControl" />
    <input matEndDate [formControl]="endControl" />
  </mat-date-range-input>
  <mat-date-range-picker #dateRangePicker></mat-date-range-picker>
  <mat-error [ngx-mat-errors]="[startControl, endControl]"></mat-error>
</mat-form-field>
```

#### `NgxMatErrorsForDateRangePicker` Directive

```typescript
import { NgxMatErrorsForDateRangePicker } from "ngx-mat-errors";
```

You can use the `[forDateRangePicker]` standalone directive to display errors for the `MatDateRangePicker` component. The directive assigns the controls used in the `MatDateRangeInput` to the `NgxMatErrors` component.

```html
<mat-form-field>
  <mat-label>Label</mat-label>
  <mat-date-range-input [rangePicker]="dateRangePicker">
    <input matStartDate formControlName="start" />
    <input matEndDate formControlName="end" />
  </mat-date-range-input>
  <mat-date-range-picker #dateRangePicker></mat-date-range-picker>
  <mat-error ngx-mat-errors forDateRangePicker></mat-error>
</mat-form-field>
```

You can easily create directives like this to display errors in a `MatFormField` with multiple controls.

## Customize

There are two ways to customize your error messages.

### Injection Token

There is the `NGX_MAT_ERROR_DEFAULT_OPTIONS` injection token. You can provide it in your `app.module.ts` with `useClass` or `useFactory` and customize your error messages globally.

This example changes only the `min` error message.

```typescript
import {
  errorMessagesEnFactory,
  NGX_MAT_ERROR_DEFAULT_OPTIONS
} from 'ngx-mat-errors';
import { FactoryProvider, LOCALE_ID } from '@angular/core';

export const NGX_MAT_ERROR_DEFAULT_CONFIG: FactoryProvider = {
  useFactory: (locale: string) => ({
    ...errorMessagesEnFactory(locale),
    min: (error: MinError) =>
      `Min value is ${error.min}, actual is ${error.actual}`,
  }),
  provide: NGX_MAT_ERROR_DEFAULT_OPTIONS,
  deps: [LOCALE_ID],
};

@NgModule({
  ...
  providers: [NGX_MAT_ERROR_DEFAULT_CONFIG],
})
export class AppModule {}
```

You can provide an `Observable<ErrorMessages>` too, which allows changes of error messages. This comes in handy when your app supports JIT localization with libraries like `@ngx-translate`.

```typescript
import {
  NGX_MAT_ERROR_DEFAULT_OPTIONS
} from 'ngx-mat-errors';
import { FactoryProvider, LOCALE_ID } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, startWith, map } from 'rxjs';

export const NGX_MAT_ERROR_DEFAULT_CONFIG: FactoryProvider = {
  useFactory: (
    locale: string,
    translateService: TranslateService
  ): Observable<ErrorMessages> => translateService.onLangChange.pipe(
    startWith(null),
    map(() => ({
      required: translateService.instant('core.validations.required'),
      minlength: (error: MinError) => translateService.instant('core.validations.minlength', error),
      ...
    }))
  ),
  provide: NGX_MAT_ERROR_DEFAULT_OPTIONS,
  deps: [LOCALE_ID, TranslateService],
};

@NgModule({
  ...
  providers: [NGX_MAT_ERROR_DEFAULT_CONFIG],
})
export class AppModule {}
```

### \*ngxMatErrorDef

You can customize your error messages even more with the `*ngxMatErrorDef` directive.

```html
<mat-form-field>
  <mat-label>Label</mat-label>
  <input type="text" matInput [formControl]="control1" />
  <mat-error ngx-mat-errors>
    <span *ngxMatErrorDef="let error; for: 'pattern'"> Only digits are allowed, up to 12 digits. </span>
    <ng-container *ngxMatErrorDef="let error; for: 'min'"> The minimum value is {{ error.min }}. </ng-container>
  </mat-error>
</mat-form-field>
```

When used with multiple controls, you can specify the control for which the error message is intended.

```html
<mat-form-field>
  <mat-label>Label</mat-label>
  <mat-date-range-input [rangePicker]="dateRangePicker">
    <input matStartDate formControlName="start" />
    <input matEndDate [formControl]="endControl" />
  </mat-date-range-input>
  <mat-date-range-picker #dateRangePicker></mat-date-range-picker>
  <mat-error ngx-mat-errors forDateRangePicker>
    <span *ngxMatErrorDef="let error; for: 'required', withControl: 'start'">Start date is required.</span>
    <span *ngxMatErrorDef="let error; for: 'required', withControl: endControl">End date is required.</span>
  </mat-error>
</mat-form-field>
```

## Compatibility

- `@angular/core`: `^18.0.0`
- `@angular/material`: `^18.0.0`

### Reactive Forms

#### Errors Inside a `MatFormField`

```html
<mat-form-field>
  <mat-label>Label</mat-label>
  <input type="text" matInput [formControl]="control" />
  <mat-error ngx-mat-errors></mat-error>
</mat-form-field>
```

#### Errors Outside a `MatFormField`

```html
<mat-error [ngx-mat-errors]="control"></mat-error>
<mat-form-field>
  <mat-label>Label</mat-label>
  <input type="text" matInput [formControl]="control" />
</mat-form-field>
```

#### Errors for Multiple Controls

```html
<mat-form-field>
  <mat-label>Label</mat-label>
  <mat-date-range-input [rangePicker]="dateRangePicker">
    <input matStartDate [formControl]="startControl" />
    <input matEndDate [formControl]="endControl" />
  </mat-date-range-input>
  <mat-date-range-picker #dateRangePicker></mat-date-range-picker>
  <mat-error [ngx-mat-errors]="[startControl, endControl]"></mat-error>
</mat-form-field>
```

### Template-Driven Forms

#### Errors Inside a `MatFormField`

```html
<mat-form-field>
  <mat-label>Label</mat-label>
  <input type="text" matInput [(ngModel)]="value" />
  <mat-error ngx-mat-errors></mat-error>
</mat-form-field>
```

#### Errors Outside a `MatFormField`

```html
<mat-error [ngx-mat-errors]="control"></mat-error>
<mat-form-field>
  <mat-label>Label</mat-label>
  <input type="text" matInput #control="ngModel" [(ngModel)]="value" />
</mat-form-field>
```

#### Errors for Multiple Controls

```html
<mat-form-field>
  <mat-label>Label</mat-label>
  <mat-date-range-input [rangePicker]="dateRangePicker">
    <input matStartDate #startControl="ngModel" [(ngModel)]="start" />
    <input matEndDate #endControl="ngModel" [(ngModel)]="end" />
  </mat-date-range-input>
  <mat-date-range-picker #dateRangePicker></mat-date-range-picker>
  <mat-error [ngx-mat-errors]="[startControl, endControl]"></mat-error>
</mat-form-field>
```

## Development

### Library Build / NPM Package

Run `npm run develop` to build the library and generate an NPM package. The build artifacts will be stored in the `dist/ngx-mat-errors` folder.

### Development Server

Run `npm start` for a dev server. Navigate to `http://localhost:4202/`. The app will automatically reload if you change any of the source files.
