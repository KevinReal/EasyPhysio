import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { IAppointment } from "../models/IAppointment";
import { AppointmentService } from "../services/appointment.service";
import { environment } from "../../environments/environment";
import * as moment from 'moment';
import { indexOf, findIndex, remove, filter, includes } from "lodash";
import { MatDialog } from "@angular/material/dialog";
import { ModalComponent } from "../modal/modal.component";
import { AppointmentsPipe } from "../pipes/appointments.pipe";
import { IPhysio } from "../models/IPhysio";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { Moment } from "moment";
import { FirebaseAuthService } from "../services/firebase-auth.service"
import { ToastService } from "../services/toast.service";
import { IRoom } from "../models/IRoom";
import { PhysioService } from "../services/physio.service";
import { flatMap } from "rxjs/internal/operators";
import { ITreatment } from "../models/ITreatment";
import { IPatient } from "../models/IPatient";

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
  flagToUpdateMonth = true;

  appointments: IAppointment[] = [];
  newAppointment: IAppointment = {
    room: {} as IRoom,
    treatment: {
      patient: {} as IPatient,
      physio: {} as IPhysio
    } as ITreatment
  } as IAppointment;

  physiosFilter: string[] = [];
  physios: IPhysio[] = [];
  physioDni: string | undefined;
  loggedPatientFilter = false;
  loggedPatientUid: string | undefined;
  // @ts-ignore
  otherUsersPermissions: flatMap<string, string[]>

  rooms: IRoom[] = [];

  constructor(private appointmentService: AppointmentService,
              private matDialog: MatDialog,
              private appointmentPipe: AppointmentsPipe,
              public firebaseAuth: FirebaseAuthService,
              private toastService: ToastService,
              private physioService: PhysioService) {
    moment.locale('es');
    this.today = moment();
    this.recalculatedDate = moment();
    this.calendarDate = moment();
    this.monthToDisplay = moment().month();
    this.yearToDisplay = moment().year();
  }

  ngOnInit() {
    this.getPhysios();
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

  dropAppointment(event: CdkDragDrop<IAppointment[]>, workingHour: string, weekDays: number): void {
    const dateSlotDropped = moment(this.recalculatedDate.year() + ' '
                                  + (this.recalculatedDate.month() + 1) + ' '
                                  + weekDays + ' '
                                  + workingHour,
                                  'yyyy MM DD hh:mm');
    if (moment() < dateSlotDropped) {
      if (indexOf(this.workingHours, workingHour) !== -1) {
        if (event.previousContainer !== event.container &&
          this.checkWorkingAndHourDayAndCheckMaxAppointmentsPerSlot(workingHour,
            weekDays,
            event.previousContainer.data[event.previousIndex])) {
          transferArrayItem(event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex);
          event.container.data[event.currentIndex].startAppointment = moment(this.recalculatedDate.year() + ' '
            + (this.recalculatedDate.month() + 1) + ' '
            + weekDays + ' '
            + workingHour,
            'yyyy MM DD hh:mm').toDate();
          event.container.data[event.currentIndex].endAppointment = moment(event.container.data[event.currentIndex].startAppointment).add(30, 'minutes').toDate();
          this.updateAppointment(event.container.data[event.currentIndex]);
        }
      } else {
        this.toastService.show('Horario fuera de las horas de trabajo del centro.', {classname: 'toast-warn', delay: 10000})
      }
    } else {
      this.toastService.show('No puede reservar cita para días anteriores a hoy.', {classname: 'toast-warn', delay: 10000})
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
          allAppointments: this.appointments,
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
    if (findIndex(this.workingHours, function (hour) {
      return hour == appointmentStartDate;
    }) !== -1) {
      this.newAppointment.startAppointment = moment(this.recalculatedDate.year() + ' '
        + (this.recalculatedDate.month() + 1) + ' '
        + weekDays + ' '
        + appointmentStartDate,
        'yyyy MM DD hh:mm').toDate();
      this.newAppointment.endAppointment = moment(this.newAppointment.startAppointment).add(30, 'minutes').toDate();

      let appointments = [];
      appointments.push(JSON.parse(JSON.stringify(this.newAppointment)));

      const modalDialog = this.matDialog.open(ModalComponent,
        {
          data: {
            allAppointments: this.appointments,
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
    const appointmentsAux = JSON.parse(JSON.stringify(this.appointmentPipe.transform(appointments,
      workingHours,
      weekDays,
      this.recalculatedDate,
      this.physiosFilter,
      this.loggedPatientFilter,
      this.loggedPatientUid)));
    let dayAndHourAppointments = moment(appointmentsAux[0].startAppointment);
    const modalDialog = this.matDialog.open(ModalComponent,
      {
        data: {
          title: 'Citas agendadas ' +
            dayAndHourAppointments.date() + '/' +
            (dayAndHourAppointments.month() + 1) + '/' +
            dayAndHourAppointments.year() + ' ' +
            workingHours + ' :',
          appointments: appointmentsAux,
          allAppointments: this.appointments,
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
      this.physiosFilter = remove(this.physiosFilter, function (e) {
        return e !== physio.dni
      });
    }
  }

  addPhysioColor(patientUid: string | undefined, dni: string, bg: boolean): string {
    let aux = '';

    if (this.loggedPatientFilter && patientUid === this.loggedPatientUid) {
      aux += 'patient';
    } else {
      aux += 'physio';
    }

    if (bg) {
      aux += '-bg';
    }

    switch (dni) {
      case '12345678L':
        aux += '1';
        break;
      case '12345678Q':
        aux += '2';
        break;
      case '12345678P':
        aux += '3';
        break;
      case '12345678K':
        aux += '4';
        break;
      default:
        break;
    }
    return aux;
  }

  filteringSatAndMonday = (d: Moment | null): boolean => {
    const day = d?.day();
    return day !== 0 && day !== 6;
  }

  isPhysioOrPatient(): void {
    this.physioDni = this.firebaseAuth.getPhysioDNI();
    this.otherUsersPermissions = this.firebaseAuth.getOtherPhysiosPermissions();
    if (!this.physioDni) {
      this.otherUsersPermissions = this.firebaseAuth.getOtherPatientsPermissions();
      this.loggedPatientUid = this.firebaseAuth.getPatientUid();
      this.loggedPatientFilter = true;
      this.physios.forEach(physio => this.physiosFilter.push(physio.dni));
    }
  }

  getPhysios(): void {
    this.physioService.getPhysios().subscribe(physios => {
      this.physios = physios;
      this.isPhysioOrPatient();
    })
  }

  checkWorkingAndHourDayAndCheckMaxAppointmentsPerSlot(workingHour: string, weekDays: number, appointment: IAppointment): boolean {
    const dateSlotDropped = moment(this.recalculatedDate.year() + ' '
                                  + (this.recalculatedDate.month() + 1) + ' '
                                  + weekDays + ' '
                                  + workingHour,
                                  'yyyy MM DD hh:mm');
    if (!includes(appointment.treatment.physio.workingDays, dateSlotDropped.day())) {
      this.toastService.show('El fisioterapeuta no trabaja ese día.', {classname: 'toast-warn', delay: 10000})
      return false;
    }
    if (!includes(appointment.treatment.physio.workingHours, workingHour)) {
      this.toastService.show('El fisioterapeuta no trabaja esa franja horaria.', {classname: 'toast-warn', delay: 10000})
      return false;
    }
    const checkMaxAppointemntsPerSlot = filter(this.appointments, function (element: IAppointment) {
      if (appointment.id === element.id) return;
      if (element.treatment.physio.dni === appointment.treatment.physio.dni) {
        const startAppointment = moment(appointment.startAppointment);
        let modifiedDateAppointment = moment(startAppointment.year() + ' '
          + (startAppointment.month() + 1) + ' '
          + weekDays + ' '
          + workingHour,
          'yyyy MM DD hh:mm');
        if (modifiedDateAppointment > element.startAppointment) {
        } else if (modifiedDateAppointment < element.startAppointment) {
        } else {
          return element;
        }
      }
      return;
    }).length > 1;
    if (checkMaxAppointemntsPerSlot) {
      this.toastService.show('Todas las citas del fisioterapeuta están cogidas para esa hora.', {classname: 'toast-warn', delay: 10000})
      return false;
    }
    return true;
  }

  physioListColor(color: string) {
    return JSON.parse(`{ "color": "${color}" }`);
  }

  physioGridColor(color: string, patientUid: string) {
    if (this.loggedPatientFilter && patientUid === this.loggedPatientUid) {
      return JSON.parse(`{ "color": "white", "background-image": "linear-gradient(to right, black 50% , ${color} 50%)" }`);
    }
    return JSON.parse(`{ "color": "white", "background-color": "${color}" }`);
  }

}
