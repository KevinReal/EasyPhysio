import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { IAppointment } from "../models/IAppointment";
import { AppointmentService } from "../services/appointment.service";
import { environment } from "../../environments/environment";
import * as moment from 'moment';
import * as _ from "lodash";
import { MatDialog } from "@angular/material/dialog";
import { ModalComponent } from "../modal/modal.component";
import { AppointmentsPipe } from "../pipes/appointments.pipe";
import { IPhysio } from "../models/IPhysio";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { Moment } from "moment";

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

  today;
  recalculatedDate;
  calendarDate;
  monthToDisplay;
  yearToDisplay;
  weekDays: number[] = [];

  appointments: IAppointment[] = [];
  newAppointment: IAppointment = {treatment: {patient: {}}} as IAppointment;

  flagToUpdateMonth = true;
  physios: IPhysio[] = [{dni: '12345678K', name: 'Pepito', lastname: 'De los Palotes'}, {
    dni: '1234',
    name: 'Juanito',
    lastname: 'asdadad'
  }, {dni: '12', name: 'Jaimito', lastname: 'sin apellido'}, {
    dni: '1',
    name: 'Jaimito2',
    lastname: 'sin apellido2'
  }] as IPhysio[];
  physiosFilter: string[] = [];

  constructor(private appointmentService: AppointmentService,
              private matDialog: MatDialog,
              private appointmentPipe: AppointmentsPipe) {
    moment.locale('es');
    this.today = moment();
    this.recalculatedDate = moment();
    this.calendarDate = moment();
    this.monthToDisplay = moment().month();
    this.yearToDisplay = moment().year();
  }

  ngOnInit() {
    this.goToToday();
    this.getAppointments();
  }

  getAppointments(): void {
    this.appointmentService.getAppointments().subscribe(appointments => {
      appointments.map(appointment => {
        appointment.startAppointment = moment.unix(appointment.startAppointment.seconds).toDate();
        appointment.endAppointment = moment.unix(appointment.endAppointment.seconds).toDate();
      });
      this.appointments = appointments;
    });
  }

  updateAppointment(appointment: IAppointment): void {
    this.appointmentService.updateAppointment(appointment).then();
  }

  updateListAppointments(appointments: IAppointment[]): void {
    this.appointmentService.updateListAppointments(appointments).then();
  }

  createAppointment(appointment: IAppointment): void {
    this.appointmentService.createAppointment(appointment).then();
  }

  deleteAppointment(appointment: IAppointment): void {
    this.appointmentService.deleteAppointment(appointment).then();
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
    this.flagToUpdateMonth = true;
    if (daysToAdd !== 0) {
      this.recalculatedDate = this.recalculatedDate.add(daysToAdd, 'days');
      this.monthToDisplay = this.recalculatedDate.month();
      this.yearToDisplay = this.recalculatedDate.year();
      this.calendarDate = moment(this.recalculatedDate);
      for (let i = 0; i <= 6; i++) {
        let dayOfWeek = this.recalculatedDate.date() - ((this.recalculatedDate.days() + 6) % 7) + i;
        this.weekDays.push(this.fixDaysFromWeek(dayOfWeek));
      }
    } else {
      this.recalculatedDate = moment();
      this.monthToDisplay = moment().month();
      this.yearToDisplay = moment().year();
      this.calendarDate = moment();
      for (let i = 0; i <= 6; i++) {
        let dayOfWeek = moment().date() - ((moment().days() + 6) % 7) + i;
        this.weekDays.push(this.fixDaysFromWeek(dayOfWeek));
      }
    }
  }

  fixDaysFromWeek(dayOfWeek: number): number {
    if (dayOfWeek <= 0) {
      if (this.flagToUpdateMonth) {
        this.flagToUpdateMonth = !this.flagToUpdateMonth;
        if (this.monthToDisplay === 0) {
          this.monthToDisplay = 11;
          this.yearToDisplay = this.yearToDisplay - 1;
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
    return dayOfWeek;
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
        },
        panelClass: 'custom-modalbox'
      });

    modalDialog.afterClosed().subscribe(result => {
      if (result?.action === 'Edit') {
        this.updateAppointment(result.appointment);
      } else if (result?.action === 'Delete') {
        this.deleteAppointment(result.appointment);
      }
    });
  }

  openModalCreate(appointmentStartDate: string, weekDays: number): void {
    if (_.findIndex(this.workingHours, function (hour) {
      return hour == appointmentStartDate;
    }) !== -1) {
      this.newAppointment = {treatment: {patient: {}}} as IAppointment;
      this.newAppointment.startAppointment = moment(this.recalculatedDate.year() + ' '
        + (this.recalculatedDate.month() + 1) + ' '
        + weekDays + ' '
        + appointmentStartDate,
        'yyyy MM DD hh:mm').toDate();
      this.newAppointment.endAppointment = moment(this.newAppointment.startAppointment).add(30, 'minutes').toDate();

      let appointments = [];
      appointments.push(this.newAppointment);

      const modalDialog = this.matDialog.open(ModalComponent,
        {
          data: {
            title: 'Crear una nueva cita:',
            appointments: appointments,
            actions: ['Create']
          },
          panelClass: 'custom-modalbox'
        });

      modalDialog.afterClosed().subscribe(result => {
        if (result?.action === 'Create') {
          this.createAppointment(result.appointment);
        }
      });
    }
  }

  openModalGroupedAppointments(appointments: IAppointment[], workingHours: string, weekDays: number): void {
    let dayAndHourAppointments = moment(appointments[0].startAppointment);
    const modalDialog = this.matDialog.open(ModalComponent,
      {
        data: {
          title: 'Citas agendadas ' +
            dayAndHourAppointments.date() + '/' +
            (dayAndHourAppointments.month() + 1) + '/' +
            dayAndHourAppointments.year() + ' ' +
            workingHours + ' :',
          appointments: JSON.parse(JSON.stringify(this.appointmentPipe.transform(appointments,
            workingHours,
            weekDays,
            this.recalculatedDate,
            this.physiosFilter))),
          actions: ['Edit', 'Delete']
        },
        panelClass: 'custom-modalbox'
      });

    modalDialog.afterClosed().subscribe(result => {
      if (result?.action === 'Edit') {
        this.updateListAppointments(result.appointments);
      } else if (result?.action === 'Delete') {
        this.deleteAppointment(result.appointment);
      }
    });
  }

  changeFilterPhysios(physio: IPhysio, event: MatCheckboxChange): void {
    if (!event.checked) {
      this.physiosFilter.push(physio.dni);
      this.getAppointments();
    } else {
      this.physiosFilter = _.remove(this.physiosFilter, function (e) {
        return e !== physio.dni
      });
    }
  }

  addPhysioColor(dni: string, bg: boolean): string {
    let physio = 'physio';
    if (bg) {
      physio += '-bg';
    }
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

  filteringSatAndMonday = (d: Moment | null): boolean => {
    const day = d?.day();
    return day !== 0 && day !== 6;
  }
}
