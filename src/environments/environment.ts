// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  numberColsGrid: Array(5),
  numberRowsGrid: Array(22),
  workDays: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
  monthsOfTheYear: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  hoursOfTheDay: ['09:00','09:30','10:00','10:30',
                 '11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00',
                 '16:30','17:00','17:30','18:00','18:30','19:00','19:30'],
  workingHours: ['09:00','09:30','10:00','10:30', '11:00','11:30','12:00','12:30',
                 '16:00', '16:30','17:00','17:30','18:00','18:30','19:00','19:30'],
  holidays: [0, 50, 175]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
