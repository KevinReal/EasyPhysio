import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl } from '@angular/forms';
import { find } from "lodash";
import { IPatient } from '../models/IPatient';
import {PatientService} from "./patient.service";

@Injectable({
  providedIn: 'root'
})

export class CustomValidationService {

  patientList: IPatient[] | undefined;

  constructor(private patientService: PatientService) {
    this.patientService.getPatients().subscribe(patients => {
      this.patientList = patients;
    });
  }

  patternValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$');
      const valid = regex.test(control.value);
      return valid ? null : { invalidPassword: true };
    };
  }

  matchPassword(fieldsToMatch: any): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const passwordControl = control.get(fieldsToMatch[0]);
      const confirmPasswordControl = control.get(fieldsToMatch[1]);
      return passwordControl?.value !== confirmPasswordControl?.value ? { passwordMismatch: true } : null;
    };
  }

  emailValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const regex = new RegExp('(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])');
      const valid = regex.test(control.value);
      return valid ? null : { invalidEmail: true };
    };
  }

  dniValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const regexNIF = new RegExp('[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]');
      const regexNIE = new RegExp('[XYZ][0-9]{7}[A-Z]');
      const validNIF = regexNIF.test(control.value);
      const validNIE = regexNIE.test(control.value);
      return (validNIF || validNIE) ? null : { invalidDNI: true };
    };
  }

  patientFromListValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      return find(this.patientList, ['uid', control.value?.uid]) ? null : { invalidPatient: true };
    };
  }

  requiredDateAppointment(requiredDateAppointment: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      return control.get(requiredDateAppointment)?.value !== '' ? null : { invalidDate: true };
    };
  }

}
