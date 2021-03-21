import { ITreatment } from "./ITreatment";
import { IPass } from "./IPass";

export interface IAppointment {
  id: number;
  startAppointment: Date;
  endAppointment: Date;
  reasonAppointment: string;
  treatment: ITreatment;
  roomNumber: number;
  pass?: IPass;
}
