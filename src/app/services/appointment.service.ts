import { Injectable } from '@angular/core';
import { Observable, of, OperatorFunction } from 'rxjs';
import { IAppointment } from '../models/IAppointment';
import { catchError, map } from 'rxjs/operators';
import { ToastService } from './toast.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})

export class AppointmentService {

  private appointmentAngularFirestoreCollection: AngularFirestoreCollection<IAppointment> | undefined;

  constructor(private toastService: ToastService,
              private afs: AngularFirestore) { }

  getAppointments(): Observable<IAppointment[]> {
    this.appointmentAngularFirestoreCollection = this.afs.collection('appointment');
    return this.appointmentAngularFirestoreCollection.snapshotChanges().pipe(
      map(appointments => appointments.map(appointment=>{
        const data = appointment.payload.doc.data() ;
        const id = appointment.payload.doc.id;
        // @ts-ignore
        return { id, ...data };
      })));
  }

  updateAppointment(appointment: IAppointment): Promise<void | OperatorFunction<unknown, unknown>> {
    return this.afs.collection('appointment').doc(appointment.id).set(appointment).then(() => {
      this.toastService.show('Se ha actualizado la cita correctamente.', {classname: 'toast-success', delay: 5000})
    }, () => catchError(this.handleError<IAppointment>('updateAppointment')));
  }

  updateListAppointments(appointments: IAppointment[]): Promise<void | OperatorFunction<unknown, unknown>> {
    const batch = this.afs.firestore.batch();
    appointments.forEach(appointment => {
      batch.set(this.afs.firestore.collection('appointment').doc(appointment.id), appointment);
    });
    return batch.commit().then(() => {
      this.toastService.show('Se han actualizado las citas correctamente.', {classname: 'toast-success', delay: 5000})
    }, () => catchError(this.handleError<IAppointment>('updateListAppointment')));
  }

  createAppointment(appointment: IAppointment): Promise<void | OperatorFunction<unknown, unknown>> {
    return this.afs.collection('appointment').add(appointment).then(() => {
        this.toastService.show('Se ha creado la cita correctamente.', { classname: 'toast-success', delay: 5000})
    }, () => catchError(this.handleError<IAppointment>('addAppointment')));
  }

  deleteAppointment(appointment: IAppointment): Promise<void | OperatorFunction<unknown, unknown>> {
    return this.afs.collection('appointment').doc(appointment.id).delete().then(() => {
      this.toastService.show('Se ha borrado la cita correctamente.', {classname: 'toast-success', delay: 5000})
    }, () => catchError(this.handleError<IAppointment>('deleteAppointment')));
  }

  getAppointmentsByPhysioAndRangeOfDates(physioDni: string, weekMultiplier: number): AngularFirestoreCollection<IAppointment> {
    const startEndAndEndDate = this.auxRangeOfDates(weekMultiplier);

    return this.afs.collection('appointment',
                                ref => ref.where('treatment.physio.dni', '==', physioDni)
                                                 .where('startAppointment', '>=', startEndAndEndDate[0])
                                                 .where('startAppointment', '<', startEndAndEndDate[1]));
  }

  getAppointmentsByInjuriesAndRangeOfDates(weekMultiplier: number): AngularFirestoreCollection<IAppointment> {
    const startEndAndEndDate = this.auxRangeOfDates(weekMultiplier);

    return this.afs.collection('appointment',
      ref => ref.where('startAppointment', '>=', startEndAndEndDate[0])
                       .where('startAppointment', '<', startEndAndEndDate[1]));
  }

  getAppointmentsByPhysioAndDay(physioDni: string, dayToSearch: number, weekMultiplier: number): AngularFirestoreCollection<IAppointment> {
    const todayForStart = new Date();
    const todayForEnd = new Date();
    const day = todayForStart.getDay();
    const date = todayForStart.getDate() - day;

    const StartDate = new Date(todayForStart.setDate(date + 1 - (7 * weekMultiplier) + dayToSearch));
    StartDate.setHours(0,0,0,0);

    const EndDate = new Date(todayForEnd.setDate(date + 1 - (7 * weekMultiplier) + dayToSearch));
    EndDate.setHours(23,59,59,999);

    return this.afs.collection('appointment',
      ref => ref.where('treatment.physio.dni', '==', physioDni)
                       .where('startAppointment', '>=', StartDate)
                       .where('startAppointment', '<', EndDate));
  }

  getAppointmentsByRoomAndRangeOfDates(roomId: string, weekMultiplier: number): AngularFirestoreCollection<IAppointment> {
    const startEndAndEndDate = this.auxRangeOfDates(weekMultiplier);

    return this.afs.collection('appointment',
      ref => ref.where('room.id', '==', roomId)
                       .where('startAppointment', '>=', startEndAndEndDate[0])
                       .where('startAppointment', '<', startEndAndEndDate[1]));
  }

  private auxRangeOfDates(weekMultiplier: number): Date[] {
    const startEndAndEndDate = [];
    const todayForStart = new Date();
    const todayForEnd = new Date();
    const day = todayForStart.getDay();
    const date = todayForStart.getDate() - day;

    const StartDate = new Date(todayForStart.setDate(date + 1 - (7 * weekMultiplier)));
    StartDate.setHours(0,0,0,0);
    startEndAndEndDate.push(StartDate);

    const EndDate = new Date(todayForEnd.setDate(date + 7));
    EndDate.setHours(23,59,59,999);
    startEndAndEndDate.push(EndDate);

    return startEndAndEndDate;
  }

  private handleError<T>(operation = 'operation', result?: T): (error: any) => Observable<T> {
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
