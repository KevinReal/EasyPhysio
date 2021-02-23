import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IWeeklySchedule } from "../models/IWeeklySchedule";
import { weeklyScheduleMock } from "../mocks/weeklyScheduleMock";

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor() { }

  getScheduleByPyshioAndRangeOfDates(physioname: string, startDate: Date, endDate: Date ): Observable<IWeeklySchedule> {
    return of(weeklyScheduleMock);
  }
}
