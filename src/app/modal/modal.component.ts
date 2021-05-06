import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { IAppointment } from "../models/IAppointment";
import * as _ from "lodash";
import { environment } from "../../environments/environment";
import * as moment from 'moment';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})

export class ModalComponent implements OnInit {

  canEdit = false;
  canDelete = false;
  canCreate = false;
  workingHours = environment.workingHours;
  selectedHour: string [] = [];

  constructor(private dialogRef: MatDialogRef<ModalComponent>,
              @Inject(MAT_DIALOG_DATA)
              public data: {
                title: string,
                appointments: IAppointment[],
                actions: string[]
              }) { }


  ngOnInit() {
    this.data.appointments.forEach(appointment =>
                                  this.selectedHour.push(moment(appointment.startAppointment).format("HH") +
                                  ':' +
                                  moment(appointment.startAppointment).format("mm")));
    this.canEdit = _.includes(this.data.actions, 'Edit');
    this.canDelete = _.includes(this.data.actions, 'Delete');
    this.canCreate = _.includes(this.data.actions, 'Create');
  }

  updateAppointment(appointment: IAppointment): void {
    appointment.startAppointment = this.startAppointment(appointment.startAppointment, this.selectedHour[0]);
    appointment.endAppointment = moment(appointment.startAppointment).add(30, 'minutes').toDate();
    let result = {
      appointment: appointment,
      action: 'Edit'
    }
    this.dialogRef.close(result);
  }

  deleteAppointment(appointment: IAppointment): void {
    let result = {
      appointment: appointment,
      action: 'Delete'
    }
    this.dialogRef.close(result);
  }

  createAppointment(appointment: IAppointment): void {
    appointment.startAppointment = this.startAppointment(appointment.startAppointment, this.selectedHour[0]);
    appointment.endAppointment = moment(appointment.startAppointment).add(30, 'minutes').toDate();
    let result = {
      appointment: appointment,
      action: 'Create'
    }
    this.dialogRef.close(result);
  }

  updateListAppointments(appointments: IAppointment[]): void {
    for (let i = 0; i < appointments.length; i++) {
      appointments[i].startAppointment = this.startAppointment(this.data.appointments[i].startAppointment, this.selectedHour[i]);
      appointments[i].endAppointment = moment(appointments[i].startAppointment).add(30, 'minutes').toDate();
    }
    let result = {
      appointments: appointments,
      action: 'Edit'
    }
    this.dialogRef.close(result);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  startAppointment(startAppointment: Date, selectedHour: string) {
    return moment(moment(startAppointment).year() + ' ' +
                  (moment(startAppointment).month() + 1) + ' ' +
                  moment(startAppointment).date() + ' ' +
                  selectedHour, 'yyyy MM DD hh:mm').toDate();
  }

  onSubmitAppointment(appointment: IAppointment) {
    if (this.canEdit) {
      this.updateAppointment(appointment)
    } else if (this.canCreate) {
      this.createAppointment(appointment);
    }
  }

  onSubmitListAppointments(appointments: IAppointment[]) {
    if (this.canEdit) {
      this.updateListAppointments(appointments);
    }
  }

  addPhysioColor(dni: string): string {
    let physio = 'physio-bg';
    switch (dni) {
      case '1':
        physio += '1';
        break;
      case '12':
        physio += '2';
        break;
      case '1234':
        physio += '3';
        break;
      case '12345678K':
        physio += '4';
        break;
      default:
        break;
    }
    return physio;
  }

}
