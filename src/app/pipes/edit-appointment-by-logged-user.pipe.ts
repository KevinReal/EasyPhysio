import { Pipe, PipeTransform } from '@angular/core';
import { IAppointment } from "../models/IAppointment";
import { flatMap } from "rxjs/internal/operators";
import { includes } from "lodash";
import * as moment from "moment";

@Pipe({
  name: 'editAppointmentByLoggedUser'
})

export class EditAppointmentByLoggedUserPipe implements PipeTransform {

  transform(appointment: IAppointment,
            // @ts-ignore
            otherUsersPermissions: flatMap<string, string[]> | undefined,
            loggedPhysioDni: string | undefined,
            loggedPatientUid: string | undefined): boolean {
    if (moment(appointment.startAppointment)  < moment()) {
      return true;
    }
    if ((loggedPhysioDni && appointment.treatment.physio.dni === loggedPhysioDni) ||
        otherUsersPermissions && includes(otherUsersPermissions[appointment.treatment.physio.dni], 'Edit')) {
      return false;
    } else if ((loggedPatientUid === appointment.treatment.patient.uid) ||
                otherUsersPermissions && includes(otherUsersPermissions[appointment.treatment.patient.email], 'Edit')) {
      return false;
    }
    return true;
  }

}
