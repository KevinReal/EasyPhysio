import { flatMap } from "rxjs/internal/operators";

export interface IPhysio {
  uid: string;
  dni: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  photo: string;
  workingDays: number[];
  workingHours: string[];
  // @ts-ignore
  otherPhysiosPermissions?: flatMap<string, string[]>;
  color: string;
}
