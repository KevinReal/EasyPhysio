import { IWeeklySchedule } from "../models/IWeeklySchedule";
import { appointmentMock1 } from "./appointmentMock";
import { appointmentMock2 } from "./appointmentMock";
import { appointmentMock3 } from "./appointmentMock";

export const weeklyScheduleMock: IWeeklySchedule = {
  physioName: 'Kevin Real',
  physioCode: 1,
  startDate: new Date(),
  endDate: new Date(),
  weeklySchedule: [
    [[appointmentMock1],[],[],[],[]],
    [[],[],[],[appointmentMock2],[]],
    [[],[],[],[],[]],
    [[],[],[],[],[]],
    [[],[],[],[],[]],
    [[],[],[],[],[]],
    [[],[],[],[],[]],
    [[],[],[],[],[]],
    [[],[],[],[],[]],
    [[],[],[],[],[]],
    [[],[],[],[],[]],
    [[],[],[],[],[]],
    [[],[],[],[],[]],
    [[],[],[],[],[]],
    [[],[],[],[],[]],
    [[],[],[],[],[appointmentMock3]],
  ]
};
