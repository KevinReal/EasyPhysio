import { flatMap } from "rxjs/internal/operators";

export interface IPatient {
  uid: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  photo?: string;
  // @ts-ignore
  otherPatientsPermissions?: flatMap<string, string[]>;
  defaultPhysio?: string;
}
