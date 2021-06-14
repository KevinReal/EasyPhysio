import { Pipe, PipeTransform } from '@angular/core';
import { flatMap } from "rxjs/internal/operators";
import { get } from "lodash";

@Pipe({
  name: 'checkOtherPatientsPermissions'
})
export class CheckOtherPatientsPermissionsPipe implements PipeTransform {

  // @ts-ignore
  transform(otherPatientsPermissions: flatMap<string, string[]>,
            loggedPatientEmail: string,
            patientEmailToCheck: string,
            permissionToCheck: string): boolean {
    if (loggedPatientEmail === patientEmailToCheck) {
      return false;
    }
    if (get(otherPatientsPermissions, patientEmailToCheck)) {
      return !get(otherPatientsPermissions, patientEmailToCheck).some((permission: string) => permission === permissionToCheck)
    }
    return true;
  }

}
