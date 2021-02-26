import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const appointments = [
      {
        id:1,
        physioName: 'Kevin Real',
        physioCode: 1,
        patientName: 'Pepito',
        roomNumber: 1,
        dateAppointment: new Date(),
        reasonAppointment: 'Zona lumbar'
      },
      {
        id:2,
        physioName: 'Kevin Real',
        physioCode: 1,
        patientName: 'Juanito',
        roomNumber: 2,
        dateAppointment: new Date(),
        reasonAppointment: 'Core'
      },
      {
        id:3,
        physioName: 'Kevin Real',
        physioCode: 1,
        patientName: 'Jaimito',
        roomNumber: 3,
        dateAppointment: new Date(),
        reasonAppointment: 'Zona cervical'
      }
    ];
    return { appointments };
  }

}
