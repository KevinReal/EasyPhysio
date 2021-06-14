import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from "@angular/forms";
import { CustomValidationService } from "../services/custom-validation.service";

@Directive({
  selector: '[appDnipattern]',
  providers: [{ provide: NG_VALIDATORS, useExisting: DnipatternDirective, multi: true }]
})

export class DnipatternDirective implements Validator {

  constructor(private customValidator: CustomValidationService) { }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.customValidator.dniValidator()(control);
  }
}
