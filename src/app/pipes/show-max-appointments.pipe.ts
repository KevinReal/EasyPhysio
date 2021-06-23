import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showMaxAppointments'
})

export class ShowMaxAppointmentsPipe implements PipeTransform {

  transform(appointmentsByPatientAndDates: any[], limit: number): any[] {
    return appointmentsByPatientAndDates.slice(0, limit);
  }

}
