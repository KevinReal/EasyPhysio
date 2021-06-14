import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from "@angular/forms";
import { CustomValidationService } from "../services/custom-validation.service";

@Directive({
  selector: '[appSelectPatientFromList]',
  providers: [{ provide: NG_VALIDATORS, useExisting: SelectPatientFromListDirective, multi: true }]
})

export class SelectPatientFromListDirective implements Validator {

  constructor(private customValidator: CustomValidationService) { }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.customValidator.patientFromListValidator()(control);
  }
}
