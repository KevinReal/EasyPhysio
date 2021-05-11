import { ITreatment } from "./ITreatment";
import { IPass } from "./IPass";

export interface IAppointment {
  id: string;
  startAppointment: any;
  endAppointment: any;
  reasonAppointment: string;
  treatment: ITreatment;
  roomNumber: number;
  pass?: IPass;
}
