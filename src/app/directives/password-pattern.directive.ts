import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { CustomValidationService } from '../services/custom-validation.service';

@Directive({
  selector: '[appPasswordPattern]',
  providers: [{ provide: NG_VALIDATORS, useExisting: PasswordPatternDirective, multi: true }]
})

export class PasswordPatternDirective implements Validator {

  constructor(private customValidator: CustomValidationService) { }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.customValidator.patternValidator()(control);
  }
}
