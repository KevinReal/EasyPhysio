import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, ValidationErrors, AbstractControl } from '@angular/forms';
import { CustomValidationService } from '../services/custom-validation.service';

@Directive({
  selector: '[appMatchPassword]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MatchPasswordDirective, multi: true }]
})

export class MatchPasswordDirective implements Validator {
  @Input('appMatchPassword') fieldsToMatch: any[] = [];

  constructor(private customValidator: CustomValidationService) { }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.customValidator.matchPassword(this.fieldsToMatch)(control);
  }
}
