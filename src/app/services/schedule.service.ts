import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAppointment } from "../models/IAppointment";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private http: HttpClient) { }

  getScheduleByPyshioAndRangeOfDates(physioname: string, startDate: Date, endDate: Date ): Observable<IAppointment[]> {
    return this.http.get<IAppointment[]>(environment.appointmentsURL);
  }

  updateAppointment(appointment: IAppointment): Observable<IAppointment> {
    return this.http.put<IAppointment>(environment.appointmentsURL, appointment, environment.httpOptions);
  }

  createAppointment(appointment: IAppointment): Observable<IAppointment> {
    return this.http.post<IAppointment>(environment.appointmentsURL, appointment, environment.httpOptions);
  }

  deleteAppointment(appointment: IAppointment): Observable<IAppointment> {
    return this.http.delete<IAppointment>(environment.appointmentsURL + '/' + appointment.id, environment.httpOptions);
  }

}
