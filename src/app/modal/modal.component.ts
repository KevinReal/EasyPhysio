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
  selectedHour = '';
  flagsEditAppointment: boolean[] = [];

  constructor(private dialogRef: MatDialogRef<ModalComponent>,
              @Inject(MAT_DIALOG_DATA)
              public data: {
                title: string,
                appointments: IAppointment[],
                actions: string[]
              }) { }


  ngOnInit() {
    this.selectedHour = moment(this.data.appointments[0].startAppointment).format("HH") +
                        ':' +
                        moment(this.data.appointments[0].startAppointment).format("mm");
    this.data.appointments.forEach(() => this.flagsEditAppointment.push(false));
    this.canEdit = _.includes(this.data.actions, 'Edit');
    this.canDelete = _.includes(this.data.actions, 'Delete');
    this.canCreate = _.includes(this.data.actions, 'Create');
  }

  updateAppointment(appointment: IAppointment): void {
    appointment.startAppointment = moment(moment(this.data.appointments[0].startAppointment).date() + ' ' + this.selectedHour, 'DD hh:mm').toDate();
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
    appointment.startAppointment = moment(moment(this.data.appointments[0].startAppointment).date() + ' ' + this.selectedHour, 'DD hh:mm').toDate();
    appointment.endAppointment = moment(appointment.startAppointment).add(30, 'minutes').toDate();
    let result = {
      appointment: appointment,
      action: 'Create'
    }
    this.dialogRef.close(result);
  }

  swapEditAppointment(index: number) {
    this.flagsEditAppointment[index] = !this.flagsEditAppointment[index];
  }

  changeDateSelected(event: any): void {

  }
}
