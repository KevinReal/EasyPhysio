import { IPhysio } from "./IPhysio";
import { IPatient } from "./IPatient";

export interface ITreatment {
  id: number;
  physio: IPhysio;
  patient: IPatient;
}
