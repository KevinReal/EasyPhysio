// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {HttpHeaders} from "@angular/common/http";

export const environment = {
  production: false,
  appointmentsURL: 'api/appointments',
  httpOptions: {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  },
  numberColsGrid: Array(5),
  numberRowsGrid: Array(48),
  workDays: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
  monthsOfTheYear: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  hoursOfTheDay: ['00:00','00:30','01:00','01:30','02:00','02:30','03:00','03:30','04:00','04:30','05:00',
                 '05:30','06:00','06:30','07:00','07:30','08:00','08:30','09:00','09:30','10:00','10:30',
                 '11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00',
                 '16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30',
                 '22:00','22:30','23:00','23:30', '00:00'],
  workingHours: ['09:00','09:30','10:00','10:30', '11:00','11:30','12:00','12:30','13:00',
                 '16:00', '16:30','17:00','17:30','18:00','18:30','19:00','19:30']
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
