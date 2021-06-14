import { Pipe, PipeTransform } from '@angular/core';
import { IAppointment } from "../models/IAppointment";
import * as moment from 'moment';
import { filter, find } from 'lodash';
import { Moment } from "moment";

@Pipe({
  name: 'appointments'
})

export class AppointmentsPipe implements PipeTransform {

  transform(appointments: any,
            workingHours: string,
            weekDays: number,
            recalculatedDate: Moment,
            physiosFilter: string[],
            loggedPatientFilter: boolean,
            loggedPatientUid: string | undefined): IAppointment[] {
    return filter(appointments, function (element: IAppointment) {

      let startAppointment = moment(element.startAppointment);
      let modifiedDateAppointment = moment(recalculatedDate.year() + ' '
        + (recalculatedDate.month() + 1) + ' '
        + weekDays + ' '
        + workingHours,
        'yyyy MM DD hh:mm');

      if (loggedPatientFilter && element.treatment.patient.uid === loggedPatientUid &&
          startAppointment.format('mm') === modifiedDateAppointment.format('mm') &&
          startAppointment.format('HH') === modifiedDateAppointment.format('HH') &&
          startAppointment.format('D') === modifiedDateAppointment.format('D') &&
          startAppointment.format('M') === modifiedDateAppointment.format('M') &&
          startAppointment.format('Y') === modifiedDateAppointment.format('Y'))
        return element;


      if(find(physiosFilter, function(obj: string) {
        return obj === element.treatment.physio.dni;
      })) return;

      if (startAppointment.format('mm') === modifiedDateAppointment.format('mm') &&
          startAppointment.format('HH') === modifiedDateAppointment.format('HH') &&
          startAppointment.format('D') === modifiedDateAppointment.format('D') &&
          startAppointment.format('M') === modifiedDateAppointment.format('M') &&
          startAppointment.format('Y') === modifiedDateAppointment.format('Y')){
        return element;
      }
      return;
    });
  }
}
