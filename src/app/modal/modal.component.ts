import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { IAppointment } from "../models/IAppointment";
import { includes, find, filter, some, indexOf } from "lodash";
import * as moment from 'moment';
import { IPhysio } from "../models/IPhysio";
import { Moment } from "moment";
import { IRoom } from "../models/IRoom";
import { PhysioService } from "../services/physio.service";
import { PatientService } from "../services/patient.service";
import { RoomService } from "../services/room.service";
import { IPatient } from "../models/IPatient";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { FirebaseAuthService } from "../services/firebase-auth.service";
import { flatMap } from "rxjs/internal/operators";
import { environment } from "../../environments/environment";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ModalComponent implements OnInit {

  holidays = environment.holidays;
  canEdit = false;
  canDelete = false;
  canCreate = false;

  workingHours: string[][] = [];
  selectedHour: string [] = [];

  physios: IPhysio[] = [];
  rooms: IRoom[] = [];
  patients: Observable<IPatient[]> | undefined;

  patientAux: any = {};
  patientsListAux: IPatient[] = [];
  patientsFilterByOtherPatientsPermissions: IPatient[] = [];
  dniAux: string[] = [];
  // @ts-ignore
  otherPhysiosPermissions: flatMap<string, string[]> = {};
  // @ts-ignore
  otherPatientsPermissions: flatMap<string, string[]> = {};

  showPatientsNoSelectedFromList = false;
  showPatientsError = false;
  showErrorSelectedHour = false;
  showErrorRoom = false;
  appointmentBeforeTodayOrHolidays = false;

  constructor(private matDialog: MatDialog,
              private dialogRef: MatDialogRef<ModalComponent>,
              private physioService: PhysioService,
              private patientService: PatientService,
              private roomService: RoomService,
              public firebaseAuth: FirebaseAuthService,
              @Inject(MAT_DIALOG_DATA)
              public data: {
                allAppointments: IAppointment[],
                title: string,
                appointments: IAppointment[],
                actions: string[]
              }) { }


  ngOnInit() {
    this.appointmentBeforeTodayOrHolidays = this.isBeforeTodayOrHolidays(this.data.appointments[0], this.holidays);
    this.canEdit = includes(this.data.actions, 'Edit');
    this.canDelete = includes(this.data.actions, 'Delete');
    this.canCreate = includes(this.data.actions, 'Create');
    this.patientService.getPatients().subscribe(patients => {
      this.patientsListAux = patients
      this.getPhysioDNIOrPatientName();
    });
    this.getRooms();
    this.getPhysios();
    this.data.appointments.forEach(appointment =>
      this.selectedHour.push(moment(appointment.startAppointment).format("HH") +
        ':' +
        moment(appointment.startAppointment).format("mm")));
    this.patientAux = this.data?.appointments[0]?.treatment?.patient;
    for (let i = 0; i < this.data?.appointments?.length; i++) {
      this.dniAux[i] = this.data.appointments[i].treatment.physio.dni;
    }
    this.otherPhysiosPermissions = this.firebaseAuth.getOtherPhysiosPermissions();
    this.otherPatientsPermissions = this.firebaseAuth.getOtherPatientsPermissions();
  }

  createAppointment(appointment: IAppointment): void {
    let result = {
      appointment: appointment,
      action: 'Create'
    }
    this.dialogRef.close(result);
  }

  updateAppointment(appointment: IAppointment): void {
    let result = {
      appointment: appointment,
      action: 'Edit'
    }
    this.dialogRef.close(result);
  }

  deleteAppointment(appointment: IAppointment): void {
    const modalDialog = this.matDialog.open(ModalComponent,
      {
        height: '25vh',
        width: '25vw',
        data: {
          title: '¡Cuidado! La acción no puede ser revertida.',
          appointments: []
        },
        panelClass: 'custom-modalbox'
      });

    modalDialog.afterClosed().subscribe(res => {
      if (res === 'OK') {
        let result = {
          appointment: appointment,
          action: 'Delete'
        }
        this.dialogRef.close(result);
      }
    });
  }

  updateListAppointments(appointments: IAppointment[]): void {
    for (let i = 0; i < appointments.length; i++) {
      this.instantiateAppointmentAttributes(appointments[i], i);
    }
    let result = {
      appointments: appointments,
      action: 'Edit'
    }
    this.dialogRef.close(result);
  }

  startAppointment(startAppointment: Date, selectedHour: string): Date {
    return moment(moment(startAppointment).year() + ' ' +
      (moment(startAppointment).month() + 1) + ' ' +
      moment(startAppointment).date() + ' ' +
      selectedHour, 'yyyy MM DD hh:mm').toDate();
  }

  instantiateAppointmentAttributes(appointment: IAppointment, index: number): IAppointment {
    appointment.startAppointment = this.startAppointment(appointment.startAppointment, this.selectedHour[index]);
    appointment.endAppointment = moment(appointment.startAppointment).add(30, 'minutes').toDate();
    appointment.room = <IRoom>find(this.rooms, ['id', appointment.room.id]);
    appointment.treatment.physio = <IPhysio>find(this.physios, ['dni', appointment.treatment.physio.dni]);
    return appointment;
  }

  onSubmitAppointment(appointment: IAppointment): void {
    if (this.firebaseAuth.getPhysioDNI()) {
      appointment.treatment.patient = this.patientAux;
    } else {
      appointment.treatment.patient = <IPatient>find(this.patientsListAux, ['uid', this.data.appointments[0].treatment.patient.uid]);
    }
    appointment = this.instantiateAppointmentAttributes(appointment, 0);
    this.showErrorSelectedHour = this.checkMaxAppointmentsPerSlot(this.selectedHour[0], appointment);
    this.showPatientsError = this.filterPatientWithAppointment(appointment.treatment.patient.uid, appointment.startAppointment, this.selectedHour[0])
    this.showErrorRoom = this.checkAvailableRoom(appointment.room.id, appointment.startAppointment, this.selectedHour[0]);
    if (!this.showErrorSelectedHour && !this.showPatientsError && !this.showErrorRoom) {
      if (this.canEdit) {
        this.updateAppointment(appointment)
      } else if (this.canCreate) {
        this.createAppointment(appointment);
      }
    }
  }

  onSubmitListAppointments(appointments: IAppointment[]): void {
    if (this.canEdit) {
      this.updateListAppointments(appointments);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.dialogRef.close('OK');
  }

  filteringNonWorkingDays = (d: Moment | null): boolean => {
    if (d && d < moment().subtract(1, "days")) {
      return false;
    }
    const disableHolidays = some(this.holidays, function (holiday) {
      if (d?.dayOfYear() === holiday) {
        return true;
      }
      return;
    });
    const day = d?.day();
    return day !== 0 &&
           day !== 6 &&
           !disableHolidays &&
           includes(find(this.physios, ['dni', this.data.appointments[0].treatment.physio.dni])?.workingDays, day);
  }

  filteringNonWorkingDaysList = (d: Moment | null): boolean => {
    if (d && d < moment().subtract(1, "days")) {
      return false;
    }
    const disableHolidays = some(this.holidays, function (holiday) {
      if (d?.dayOfYear() === holiday) {
        return true;
      }
      return;
    });
    const day = d?.day();
    return day !== 0 && day !== 6 && !disableHolidays;
  }

  getPhysios(): void {
    this.physioService.getPhysios().subscribe(physios => {
      this.physios = physios.sort(function(a, b) {
        if (a.fullName < b.fullName) return -1;
        if (a.fullName > b.fullName) return 1;
        return 0;
      });
      if (this.canCreate) {
        if (this.firebaseAuth.getPhysioDNI()) {
          this.changeWorkingHoursAndWorkingDate(this.firebaseAuth.getPhysioDNI(), 0);
        } else {
          this.changeWorkingHoursAndWorkingDate(this.firebaseAuth.getDefaultPhysio(), 0);
        }
      } else if (this.canEdit) {
        for (let i = 0; i < this.data.appointments.length; i++) {
          this.changeWorkingHoursAndWorkingDate(this.data.appointments[i].treatment.physio.dni, i);
        }
      }
    });
  }

  getRooms(): void {
    this.roomService.getRooms().subscribe(rooms => {
      this.rooms = rooms.sort(function(a, b) {
        if (a.number < b.number) return -1;
        if (a.number > b.number) return 1;
        return 0;
      });
    });
  }

  getPhysioDNIOrPatientName(): void {
    if (this.canCreate) {
      if (this.firebaseAuth.getPhysioDNI()) {
        this.data.appointments[0].treatment.physio.dni = this.firebaseAuth.getPhysioDNI();
      } else {
        this.data.appointments[0].treatment.patient.uid = this.firebaseAuth.getPatientUid();
      }
    }
    const loggedPatient = find(this.patientsListAux, ['uid', this.firebaseAuth.getPatientUid()]);
    this.patientsFilterByOtherPatientsPermissions.push(<IPatient>loggedPatient);
    for (const key in loggedPatient?.otherPatientsPermissions) {
      if(loggedPatient?.otherPatientsPermissions[key].some((permission: string) => permission === 'Create')) {
        this.patientsFilterByOtherPatientsPermissions.push(<IPatient>find(this.patientsListAux, ['email', key]));
      }
    }
  }

  filterPatients(): void {
    this.patients = this.patientService.getPatients()
      .pipe(
        map(patients => patients.filter(patient =>
          patient.fullName.includes(this.patientAux)))
      )
  }

  displayFn(patient: IPatient): string {
    return patient && patient.fullName ? patient.fullName : '';
  }

  changeWorkingHoursAndWorkingDate(dni: string, index: number) {
    if (moment(this.data.appointments[index].startAppointment) < moment().startOf('day') && this.canCreate || this.appointmentBeforeTodayOrHolidays) {
      this.data.appointments[index].startAppointment = '';
      this.selectedHour[index] = '';
    } else {
      // @ts-ignore
      this.workingHours[index] = find(this.physios, ['dni', dni])?.workingHours.sort((function(a, b) {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      }));
      if (!includes(this.workingHours[index], this.selectedHour[index])){
        this.selectedHour[index] = '';
      }
      if (this.data.appointments.length > 0 &&
        !includes(find(this.physios, ['dni', dni])?.workingDays, moment(this.data.appointments[index].startAppointment).day())) {
        this.data.appointments[index].startAppointment = '';
        this.selectedHour[index] = '';
      }
    }
  }

  checkMaxAppointmentsPerSlot(workingHour: string, appointment: IAppointment) {
    return filter(this.data.allAppointments, (element: IAppointment) => {
      if (element.treatment.physio.dni === appointment.treatment.physio.dni) {
        return this.compareDatesAux(appointment.startAppointment, workingHour, element)
      }
      return;
    }).length > 1;
  }

  filterPatientWithAppointment(patientUid: string, startAppointment: any, selectedHour: string): boolean {
    return some(this.data.allAppointments, (element: IAppointment) => {
      if (element.treatment.patient.uid === patientUid) {
       return this.compareDatesAux(startAppointment, selectedHour, element);
      }
      return;
    });
  }

  checkAvailableRoom(roomId: string, startAppointment: any, selectedHour: string): boolean {
    return some(this.data.allAppointments, (element: IAppointment) => {
      return this.compareDatesAux(startAppointment, selectedHour, element)?.room.id === roomId;
    });
  }

  compareDatesAux(startAppointment: any, selectedHour: string, appointment: IAppointment): IAppointment | undefined {
    const startAppointmentMoment = moment(startAppointment);
    let modifiedDateAppointment = moment(startAppointmentMoment.year() + ' '
      + (startAppointmentMoment.month() + 1) + ' '
      + startAppointmentMoment.date() + ' '
      + selectedHour,
      'yyyy MM DD hh:mm');
    if (modifiedDateAppointment > moment(appointment.startAppointment)) {
    } else if (modifiedDateAppointment < moment(appointment.startAppointment)) {
    } else return appointment;
    return;
  }

  isBeforeTodayOrHolidays(appointment: IAppointment, holidays: number[]): boolean {
    if (moment().startOf('day') > moment(appointment?.startAppointment) || (indexOf(holidays, moment(appointment?.startAppointment).dayOfYear()) !== -1) ) {
      return true;
    } else if (moment().startOf('day') < moment(appointment?.startAppointment)) {
    } else return false;
    return false;
  }

  focusOut() {
    this.showPatientsNoSelectedFromList = true;
  }

  focusIn() {
    this.showPatientsNoSelectedFromList = false;
    this.showPatientsError = false;
  }

  physioGridColor(color: string, patientUid: string) {
    if (this.firebaseAuth.getPatientUid() && patientUid === this.firebaseAuth.getPatientUid()) {
      return JSON.parse(`{ "color": "white", "background-image": "linear-gradient(to right, black 50% , ${color} 50%)" }`);
    }
    return JSON.parse(`{ "color": "white", "background-color": "${color}" }`);
  }

}
