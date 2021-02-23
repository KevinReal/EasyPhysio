import { IAppointment } from "./IAppointment";

export interface IWeeklySchedule {
  physioName: string;
  physioCode: number,
  startDate: Date,
  endDate: Date,
  weeklySchedule: IAppointment[][][];
}
