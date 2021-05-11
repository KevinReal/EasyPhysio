import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IAppointment } from "../models/IAppointment";
import { catchError, map } from "rxjs/operators";
import { ToastService } from "./toast.service";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})

export class AppointmentService {

  private appointmentAngularFirestoreCollection: AngularFirestoreCollection<IAppointment> | undefined;

  constructor(private toastService: ToastService,
              private angularFire: AngularFirestore) { }

  getAppointments() {
    this.appointmentAngularFirestoreCollection = this.angularFire.collection("appointments");
    return this.appointmentAngularFirestoreCollection.snapshotChanges().pipe(
      map(appointments => appointments.map(appointment=>{
        const data = appointment.payload.doc.data() ;
        const id = appointment.payload.doc.id;
        // @ts-ignore
        return { id, ...data };
      })));
  }

  updateAppointment(appointment: IAppointment) {
    return this.angularFire.collection("appointments").doc(appointment.id).set(appointment).then(() => {
      this.toastService.show('Se ha actualizado la cita correctamente.', {classname: 'toast-success', delay: 5000})
    }, () => catchError(this.handleError<IAppointment>('updateAppointment')));
  }

  updateListAppointments(appointments: IAppointment[]) {
    const batch = this.angularFire.firestore.batch();
    appointments.forEach(appointment => {
      batch.set(this.angularFire.firestore.collection("appointments").doc(appointment.id), appointment);
    });
    return batch.commit().then(() => {
      this.toastService.show('Se han actualizado las citas correctamente.', {classname: 'toast-success', delay: 5000})
    }, () => catchError(this.handleError<IAppointment>('updateListAppointment')));
  }

  createAppointment(appointment: IAppointment) {
    return this.angularFire.collection("appointments").add(appointment).then(() => {
        this.toastService.show('Se ha creado la cita correctamente.', { classname: 'toast-success', delay: 5000})
    }, () => catchError(this.handleError<IAppointment>('addAppointment')));
  }

  deleteAppointment(appointment: IAppointment) {
    return this.angularFire.collection("appointments").doc(appointment.id).delete().then(() => {
      this.toastService.show('Se ha borrado la cita correctamente.', {classname: 'toast-success', delay: 5000})
    }, () => catchError(this.handleError<IAppointment>('deleteAppointment')));
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
