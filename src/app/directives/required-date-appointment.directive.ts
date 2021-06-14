import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from "@angular/forms";
import { CustomValidationService } from "../services/custom-validation.service";

@Directive({
  selector: '[appRequiredDateAppointment]',
  providers: [{ provide: NG_VALIDATORS, useExisting: RequiredDateAppointmentDirective, multi: true }]
})

export class RequiredDateAppointmentDirective implements Validator {
  @Input('appRequiredDateAppointment') requiredDateAppointment = '';

  constructor(private customValidator: CustomValidationService) { }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.customValidator.requiredDateAppointment(this.requiredDateAppointment)(control);
  }
}
