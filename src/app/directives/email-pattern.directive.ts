import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, ValidationErrors, AbstractControl } from '@angular/forms';
import { CustomValidationService } from '../services/custom-validation.service';

@Directive({
  selector: '[appEmailPattern]',
  providers: [{ provide: NG_VALIDATORS, useExisting: EmailPatternDirective, multi: true }]
})

export class EmailPatternDirective implements Validator {

  constructor(private customValidator: CustomValidationService) { }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.customValidator.emailValidator()(control);
  }
}
