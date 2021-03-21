import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { IAppointment } from "../models/IAppointment";
import { ScheduleService } from "../services/schedule.service";
import { environment } from "../../environments/environment";
import * as moment from 'moment';
import * as _ from "lodash";
import { MatDialog } from "@angular/material/dialog";
import { ModalComponent } from "../modal/modal.component";
import { AppointmentsPipe } from "../pipes/appointments.pipe";

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})

export class SchedulerComponent implements OnInit {

  numberColsGrid = environment.numberColsGrid;
  numberRowsGrid = environment.numberRowsGrid;
  workDays = environment.workDays;
  hoursOfTheDay = environment.hoursOfTheDay;
  monthsOfTheYear = environment.monthsOfTheYear;
  workingHours = environment.workingHours;

  recalculatedDate = moment();
  calendarDate = moment();
  getAppointmentsStartDate = moment();
  getAppointmentsEndDate = moment();
  monthToDisplay = moment().month();
  yearToDisplay = moment().year();
  weekDays: number[] = [];

  appointments: IAppointment[] = [];
  newAppointment: IAppointment = { treatment: { patient: {}}} as IAppointment;

  constructor(private scheduleService: ScheduleService,
              private matDialog: MatDialog,
              private appointmentPipe: AppointmentsPipe) { }

  ngOnInit() {
    this.goToToday();
    this.getAppointmentsByRangeOfDates();
  }

  getAppointmentsByRangeOfDates(): void {
    this.scheduleService.getAppointmentsByRangeOfDates(this.getAppointmentsStartDate, this.getAppointmentsEndDate)
      .subscribe(weeklySchedule => this.appointments = weeklySchedule);
  }

  updateAppointment(appointment: IAppointment): void {
    this.scheduleService.updateAppointment(appointment).subscribe(() => this.getAppointmentsByRangeOfDates());
  }

  createAppointment(appointment: IAppointment): void {
    this.scheduleService.createAppointment(appointment).subscribe(()=> this.getAppointmentsByRangeOfDates());
  }

  deleteAppointment(appointment: IAppointment): void {
    this.scheduleService.deleteAppointment(appointment).subscribe(() => this.getAppointmentsByRangeOfDates());
  }

  drop(event: CdkDragDrop<IAppointment[]>, workingHour: string, weekDays: number): void {
    if (_.indexOf(this.workingHours, workingHour) !== -1) {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
        event.container.data[0].startAppointment = moment(weekDays + ' ' + workingHour, 'DD hh:mm').toDate();
        event.container.data[0].endAppointment = moment(event.container.data[0].startAppointment).add(30, 'minutes').toDate();
        this.updateAppointment(event.container.data[0]);
      }
    }
  }

  goToToday(): void {
    this.populateWeekDays(0);
  }

  goToPreviousWeek(): void {
    this.populateWeekDays(-7);
  }

  goToNextWeek(): void {
    this.populateWeekDays(7);
  }

  // TODO: control leap year
  populateWeekDays(daysToAdd: number): void {
    this.weekDays = [];
    let flagToUpdateMonth = true;
    if (daysToAdd !== 0) {
      this.recalculatedDate = this.recalculatedDate.add(daysToAdd, 'days');
      this.monthToDisplay = this.recalculatedDate.month();
      this.yearToDisplay = this.recalculatedDate.year();
      this.calendarDate = moment(this.recalculatedDate);
      for (let i = 0; i <= 6; i++) {
        let dayOfWeek = this.recalculatedDate.date() - ((this.recalculatedDate.days() + 6) % 7) + i;
        if (dayOfWeek <= 0) {
          if (flagToUpdateMonth){
            flagToUpdateMonth = !flagToUpdateMonth;
            if (this.monthToDisplay === 0) {
              this.monthToDisplay = 11;
            } else {
              this.monthToDisplay -= 1;
            }
          }
          switch (this.monthToDisplay) {
            case 0:
            case 2:
            case 4:
            case 6:
            case 7:
            case 9:
            case 11:
              dayOfWeek += 31;
              break;
            case 1:
              dayOfWeek += 28;
              break;
            default:
              dayOfWeek += 30;
              break;
          }
        } else if (dayOfWeek > 28 && this.monthToDisplay === 1) {
          dayOfWeek -= 28;
        } else if (dayOfWeek > 30 && (this.monthToDisplay === 3 || this.monthToDisplay === 5 ||
                                      this.monthToDisplay === 8 || this.monthToDisplay === 10)) {
          dayOfWeek -= 30;
        } else if (dayOfWeek > 31 && (this.monthToDisplay === 0 || this.monthToDisplay === 2 ||
                                      this.monthToDisplay === 4 || this.monthToDisplay === 6 ||
                                      this.monthToDisplay === 7 || this.monthToDisplay === 9 ||
                                      this.monthToDisplay === 11)) {
          dayOfWeek -= 31;
        }
        this.weekDays.push(dayOfWeek);
      }
    } else {
      this.recalculatedDate = moment();
      this.monthToDisplay = moment().month();
      this.yearToDisplay = moment().year();
      this.calendarDate = moment();
      for (let i = 0; i <= 6; i++) {
        let dayOfWeek = moment().date() - ((moment().days() + 6) % 7) + i ;
        this.weekDays.push(dayOfWeek);
      }
    }
    this.getAppointmentsStartDate = moment(this.weekDays[0], "D");
    this.getAppointmentsEndDate = moment(this.weekDays[4], "D").endOf('day');
  }

  changeDateSelected(event: any): void {
    this.populateWeekDays(event.value.diff(this.recalculatedDate.startOf('day'), 'days'));
  }

  openModalEditDelete(appointment: IAppointment): void {
    let appointments = [];
    appointments.push(JSON.parse(JSON.stringify(appointment)));

    const modalDialog = this.matDialog.open(ModalComponent,
      {
        data: {
          title: 'Detalles de la cita:',
          appointments: appointments,
          actions: ['Edit', 'Delete']
        }
      });

    modalDialog.afterClosed().subscribe(result => {
      if (result.action === 'Edit') {
        this.updateAppointment(result.appointment);
      } else if (result.action === 'Delete') {
        this.deleteAppointment(result.appointment);
      }
    });
  }

  openModalCreate(appointmentStartDate: string, weekDays: number, appointmentEndDate: string): void {
    this.newAppointment = { treatment: { patient: {}}} as IAppointment;
    this.newAppointment.startAppointment = moment(weekDays + ' ' + appointmentStartDate, 'DD hh:mm').toDate();
    this.newAppointment.endAppointment = moment(weekDays + ' ' + appointmentEndDate, 'DD hh:mm').toDate();
    let appointments = [];
    appointments.push(this.newAppointment);

    const modalDialog = this.matDialog.open(ModalComponent,
      {
        data: {
          title: 'Crear una nueva cita:',
          appointments: appointments,
          actions: ['Create']
        }
      });

    modalDialog.afterClosed().subscribe(result => {
      if (result.action === 'Create') {
        this.createAppointment(result.appointment);
      }
    });
  }

  openModalGroupedAppointments(appointments: any, workingHours: string, weekDays: number): void {
    const modalDialog = this.matDialog.open(ModalComponent,
      {
        data: {
          title: 'Lista de citas agendadas:',
          appointments: this.appointmentPipe.transform(appointments, workingHours, weekDays),
          actions: ['Edit', 'Delete']
        }
      });

    modalDialog.afterClosed().subscribe(result => {
      if (result.action === 'Edit') {
        this.updateAppointment(result.appointment);
      } else if (result.action === 'Delete') {
        this.deleteAppointment(result.appointment);
      }
    });
  }

}
