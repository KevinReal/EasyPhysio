import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { IAppointment } from "../models/IAppointment";
import { ITreatment } from "../models/ITreatment";
import { IPhysio } from "../models/IPhysio";
import { IPatient } from "../models/IPatient";

@Injectable({
  providedIn: 'root',
})

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const appointments: IAppointment[] = [
      {
        id: 1,
        startAppointment: new Date('May 04 2021 12:00:00'),
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
        startAppointment: new Date('May 03, 2021 12:00:00'),
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
        startAppointment: new Date('May 04 2021 12:30:00'),
        endAppointment: new Date(),
        reasonAppointment: 'me duele todo :(',
        roomNumber: 3,
        treatment: {
          id: 3,
          physio: {
            dni: '1',
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
        startAppointment: new Date('May 06 2021 11:00:00'),
        endAppointment: new Date(),
        reasonAppointment: 'me lo dijo el médico',
        roomNumber: 4,
        treatment: {
          id: 4,
          physio: {
            dni: '12345678K',
            name: 'Juanito',
            lastname: 'jejejeje',
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
      },{
        id: 5,
        startAppointment: new Date('May 07 2021 18:00:00'),
        endAppointment: new Date(),
        reasonAppointment: 'me lo dijo el médico',
        roomNumber: 4,
        treatment: {
          id: 5,
          physio: {
            dni: '12',
            name: 'Juanito',
            lastname: 'jejejeje',
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
      },{
        id: 6,
        startAppointment: new Date('May 05 2021 09:00:00'),
        endAppointment: new Date(),
        reasonAppointment: 'me lo dijo el médico',
        roomNumber: 4,
        treatment: {
          id: 4,
          physio: {
            dni: '1234',
            name: 'Juanito',
            lastname: 'jejejeje',
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
      },{
        id: 7,
        startAppointment: new Date('May 05 2021 11:00:00'),
        endAppointment: new Date(),
        reasonAppointment: 'me lo dijo el médico',
        roomNumber: 4,
        treatment: {
          id: 4,
          physio: {
            dni: '1234',
            name: 'Juanito',
            lastname: 'jejejeje',
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
      },{
        id: 8,
        startAppointment: new Date('May 05 2021 11:00:00'),
        endAppointment: new Date(),
        reasonAppointment: 'me lo dijo el médico',
        roomNumber: 4,
        treatment: {
          id: 4,
          physio: {
            dni: '1234',
            name: 'Juanito',
            lastname: 'jejejeje',
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
      },{
        id: 9,
        startAppointment: new Date('May 05 2021 11:00:00'),
        endAppointment: new Date(),
        reasonAppointment: 'me lo dijo el médico',
        roomNumber: 4,
        treatment: {
          id: 4,
          physio: {
            dni: '1234',
            name: 'Juanito',
            lastname: 'jejejeje',
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
      },{
        id: 10,
        startAppointment: new Date('May 05 2021 11:00:00'),
        endAppointment: new Date(),
        reasonAppointment: 'me lo dijo el médico',
        roomNumber: 4,
        treatment: {
          id: 4,
          physio: {
            dni: '1234',
            name: 'Juanito',
            lastname: 'jejejeje',
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
