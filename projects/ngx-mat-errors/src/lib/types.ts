import { TemplateRef } from "@angular/core";
import { ValidationErrors } from "@angular/forms";

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
