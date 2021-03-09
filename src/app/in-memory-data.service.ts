import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import {IAppointment} from "./models/IAppointment";
import {ITreatment} from "./models/ITreatment";
import {IPhysio} from "./models/IPhysio";
import {IPatient} from "./models/IPatient";

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const appointments: IAppointment[] = [
      {
        id: 1,
        dateAppointment: new Date(),
        startAppointment: new Date('March 8, 2021 12:00:00'),
        endAppointment: new Date(),
        reasonAppointment: 'Zona lumbar',
        roomNumber: 1,
        treatment: {
          id: 1,
          physio: {
            dni: '12345678K',
            name: 'Pepito',
            lastname: 'De los Palotes',
            phoneNumber: '123456789',
            photo: 'imagen base64 aqui jeje',
          } as IPhysio,
          patient: {
            email: 'pacientemock@easyphysio.com',
            name: 'Juanito',
            lastname: 'Menda Lerenda',
            phoneNumber: '123456789',
            photo: 'imagen base64 aqui jeje',
          } as IPatient,
        } as ITreatment,
      },
      {
        id: 2,
        dateAppointment: new Date(),
        startAppointment: new Date('March 8, 2021 12:00:00'),
        endAppointment: new Date(),
        reasonAppointment: 'Core',
        roomNumber: 2,
        treatment: {
          id: 2,
          physio: {
            dni: '12345678K',
            name: 'Pepito',
            lastname: 'De los Palotes',
            phoneNumber: '123456789',
            photo: 'imagen base64 aqui jeje',
          } as IPhysio,
          patient: {
            email: 'pacientemock@easyphysio.com',
            name: 'Pepito',
            lastname: 'primo del otro',
            phoneNumber: '123456789',
            photo: 'imagen base64 aqui jeje',
          } as IPatient,
        } as ITreatment,
      },
      {
        id: 3,
        dateAppointment: new Date(),
        startAppointment: new Date('March 9, 2021 12:30:00'),
        endAppointment: new Date(),
        reasonAppointment: 'me duele todo :(',
        roomNumber: 3,
        treatment: {
          id: 3,
          physio: {
            dni: '12345678K',
            name: 'Pepito',
            lastname: 'De los Palotes',
            phoneNumber: '123456789',
            photo: 'imagen base64 aqui jeje',
          } as IPhysio,
          patient: {
            email: 'pacientemock@easyphysio.com',
            name: 'Pulgarcito',
            lastname: 'el de pinocho',
            phoneNumber: '123456789',
            photo: 'imagen base64 aqui jeje',
          } as IPatient,
        } as ITreatment,
      },
      {
        id: 4,
        dateAppointment: new Date(),
        startAppointment: new Date('March 11, 2021 13:00:00'),
        endAppointment: new Date(),
        reasonAppointment: 'me lo dijo el médico',
        roomNumber: 4,
        treatment: {
          id: 4,
          physio: {
            dni: '12345678K',
            name: 'Pepito',
            lastname: 'De los Palotes',
            phoneNumber: '123456789',
            photo: 'imagen base64 aqui jeje',
          } as IPhysio,
          patient: {
            email: 'pacientemock@easyphysio.com',
            name: 'Tupac',
            lastname: 'Shakur',
            phoneNumber: '123456789',
            photo: 'imagen base64 aqui jeje',
          } as IPatient,
        } as ITreatment,
      }
    ];
    return { appointments };
  }

}
