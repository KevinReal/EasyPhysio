import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IAppointment } from "../models/IAppointment";
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Moment } from "moment";
import { catchError, map } from "rxjs/operators";
import { ToastService } from "./toast.service";

@Injectable({
  providedIn: 'root'
})

export class AppointmentService {

  constructor(private http: HttpClient,
              private toastService: ToastService) { }

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
        map(data =>{
          this.toastService.show('Se ha actualizado la cita correctamente.',{ classname: 'toast-success', delay: 5000})
          return data;
        }),
        catchError(this.handleError<IAppointment>('updateAppointment'))
      );
  }

  updateListAppointments(appointments: IAppointment[]): Observable<IAppointment[]> {
    return this.http.put<IAppointment[]>(environment.appointmentsURL, appointments, environment.httpOptions)
      .pipe(
        map(data =>{
          this.toastService.show('Se han actualizado las citas correctamente.', { classname: 'toast-success', delay: 5000})
          return data;
        }),
        catchError(this.handleError<IAppointment[]>('updateListAppointments'))
      );
  }

  createAppointment(appointment: IAppointment): Observable<IAppointment> {
    return this.http.post<IAppointment>(environment.appointmentsURL, appointment, environment.httpOptions)
      .pipe(
        map(data =>{
          this.toastService.show('Se ha creado la cita correctamente.', { classname: 'toast-success', delay: 5000})
          return data;
        }),
        catchError(this.handleError<IAppointment>('addAppointment'))
      );
  }

  deleteAppointment(appointment: IAppointment): Observable<IAppointment> {
    return this.http.delete<IAppointment>(environment.appointmentsURL + '/' + appointment.id, environment.httpOptions)
      .pipe(
        map(data =>{
          this.toastService.show('Se ha borrado la cita correctamente.', { classname: 'toast-success', delay: 5000})
          return data;
        }),
        catchError(this.handleError<IAppointment>('deleteAppointment'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure.
      console.error(`${operation} failed:`); // log to console meanwhile.
      console.error(error); // log to console meanwhile.

      this.toastService.show('Se ha producido un error. Inténtelo más tarde.', { classname: 'toast-warn', delay: 10000});

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
