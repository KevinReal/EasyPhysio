export interface IAppointment {
  id: number;
  physioName: string;
  physioCode: number;
  patientName: string;
  roomNumber: number;
  dateAppointment: Date;
  reasonAppointment: string;
}
