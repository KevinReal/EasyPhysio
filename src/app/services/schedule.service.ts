import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IAppointment } from "../models/IAppointment";
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Moment } from "moment";
import { catchError } from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private http: HttpClient) { }

  getAppointmentsByRangeOfDates(startDate: Moment, endDate: Moment ): Observable<IAppointment[]> {
    const options = { params: new HttpParams()
                              .set('startDate', startDate.toISOString())
                              .set('endDate', endDate.toISOString())};
    return this.http.get<IAppointment[]>(environment.appointmentsURL)
      .pipe(
        catchError(this.handleError<IAppointment[]>('getAppointments', []))
      );
  }

  updateAppointment(appointment: IAppointment): Observable<IAppointment> {
    return this.http.put<IAppointment>(environment.appointmentsURL, appointment, environment.httpOptions)
      .pipe(
        catchError(this.handleError<IAppointment>('updateAppointment'))
      );
  }

  addAppointment(appointment: IAppointment): Observable<IAppointment> {
    return this.http.post<IAppointment>(environment.appointmentsURL, appointment, environment.httpOptions)
      .pipe(
        catchError(this.handleError<IAppointment>('addAppointment'))
      );
  }

  deleteAppointment(appointment: IAppointment): Observable<IAppointment> {
    return this.http.delete<IAppointment>(environment.appointmentsURL + '/' + appointment.id, environment.httpOptions)
      .pipe(
        catchError(this.handleError<IAppointment>('deleteAppointment'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure.
      console.error(error); // log to console meanwhile.

      // TODO: show error to user consumption.
      console.log(`${operation} failed: ${error.message}`); // log to console meanwhile.

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
