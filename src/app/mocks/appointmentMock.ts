import { IAppointment } from "../models/IAppointment";

export const appointmentMock1: IAppointment = {
  id:1,
  physioName: 'Kevin Real',
  physioCode: 1,
  patientName: 'Pepito',
  roomNumber: 1,
  dateAppointment: new Date(),
  reasonAppointment: 'Zona lumbar'
};

export const appointmentMock2: IAppointment = {
  id:1,
  physioName: 'Kevin Real',
  physioCode: 1,
  patientName: 'Juanito',
  roomNumber: 2,
  dateAppointment: new Date(),
  reasonAppointment: 'Core'
};

export const appointmentMock3: IAppointment = {
  id:1,
  physioName: 'Kevin Real',
  physioCode: 1,
  patientName: 'Jaimito',
  roomNumber: 3,
  dateAppointment: new Date(),
  reasonAppointment: 'Zona cervical'
};
