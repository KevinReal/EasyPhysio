import { Pipe, PipeTransform } from '@angular/core';
import { get } from "lodash";
import { flatMap } from "rxjs/internal/operators";

@Pipe({
  name: 'checkOtherPhysiosPermissions'
})

export class CheckOtherPhysiosPermissionsPipe implements PipeTransform {

  // @ts-ignore
  transform(otherPhysiosPermissions: flatMap<string, string[]>,
            loggedPhysioDni: string | undefined,
            physioDniToCheck: string | undefined,
            permissionToCheck: string): boolean {
    if (!physioDniToCheck || !loggedPhysioDni || loggedPhysioDni === physioDniToCheck) {
      return false;
    }
    if (get(otherPhysiosPermissions, physioDniToCheck)) {
      return !get(otherPhysiosPermissions, physioDniToCheck).some((permission: string) => permission === permissionToCheck)
    }
    return true;
  }

}
