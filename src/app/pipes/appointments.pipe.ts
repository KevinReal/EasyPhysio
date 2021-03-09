import { Pipe, PipeTransform } from '@angular/core';
import { IAppointment } from "../models/IAppointment";
import * as moment from 'moment';
import * as _ from 'lodash';

@Pipe({
  name: 'appointments'
})
export class AppointmentsPipe implements PipeTransform {

  transform(appointments: any, workingHours: string, weekDays: number): IAppointment[] {
    return _.filter(appointments, function (element) {
      let startAppointment = moment(element.startAppointment);
      let modifiedDateAppointment = moment(weekDays + ' ' + workingHours, 'DD hh:mm')
      if (startAppointment.format('mm') === modifiedDateAppointment.format('mm') &&
          startAppointment.format('HH') === modifiedDateAppointment.format('HH') &&
          startAppointment.format('D') === modifiedDateAppointment.format('D')) {
        return element;
      }
    });
  }
}
