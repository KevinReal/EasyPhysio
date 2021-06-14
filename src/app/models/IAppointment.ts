import { ITreatment } from "./ITreatment";
import { IPass } from "./IPass";
import { IRoom } from "./IRoom";

export interface IAppointment {
  id: string;
  startAppointment: any;
  endAppointment: any;
  reasonAppointment: string;
  treatment: ITreatment;
  room: IRoom;
  pass?: IPass;
}
