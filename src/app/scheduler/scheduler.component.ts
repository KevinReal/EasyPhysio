import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { IAppointment } from "../models/IAppointment";
import { ScheduleService } from "../services/schedule.service"
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from 'moment';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {

  numberCols = Array(5);
  numberRowsGrid = Array(48);

  appointments: IAppointment[] = [];
  currentDate = new Date();

  daysOfTheWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  monthsOfTheYear = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                     'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  workingHours = ['00:00','00:30','01:00','01:30','02:00','02:30','03:00','03:30','04:00','04:30','05:00',
                  '05:30','06:00','06:30','07:00','07:30','08:00','08:30','09:00','09:30','10:00','10:30',
                  '11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00',
                  '16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30',
                  '22:00','22:30','23:00','23:30', '00:00'];

  weekDays: number[] = [];
  recalculatedDate = new Date();
  recalculatedMonth = this.currentDate.getMonth();

  selectedAppointment: IAppointment = {} as IAppointment;
  newAppointment: IAppointment = {} as IAppointment;
  gridIPosition = -1;
  gridJPosition = -1;

  constructor(private scheduleService: ScheduleService,
              private modalService: NgbModal) { }

  ngOnInit() {
    this.getScheduleByPyshioAndRangeOfDates();
    this.populateWeekDays(0);
  }

  getScheduleByPyshioAndRangeOfDates(): void {
    this.scheduleService.getScheduleByPyshioAndRangeOfDates('', this.currentDate, this.currentDate).subscribe(
      weeklySchedule =>  this.appointments = weeklySchedule);
  }

  updateAppointment(appointment: IAppointment): void {
    this.scheduleService.updateAppointment(appointment).subscribe(ok => {
      this.getScheduleByPyshioAndRangeOfDates();
      console.log(ok);
    });
  }

  createAppointment(appointment: IAppointment): void {
    this.scheduleService.createAppointment(appointment).subscribe(ok => {
      this.scheduleService.getScheduleByPyshioAndRangeOfDates('', this.currentDate, this.currentDate).subscribe(X => {
        console.log(X);
      });
    });
  }

  /*deleteAppointment(appointment: IAppointment): void {
    this.scheduleService.deleteAppointment(appointment).subscribe(
      () => this.mockSchedule[this.gridIPosition][this.gridJPosition] =
        this.mockSchedule[this.gridIPosition][this.gridJPosition].filter(h => h !== appointment));
  }*/

  drop(event: CdkDragDrop<IAppointment[]>, workingHours: string, weekDays: number): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      event.container.data[0].startAppointment = moment(weekDays + ' ' + workingHours, 'DD hh:mm').toDate();
      this.updateAppointment(event.container.data[0]);
    }
  }

  populateWeekDays(daysToAdd: number): void {
    this.weekDays = [];
    if (daysToAdd !== 0) {
      this.recalculatedDate = new Date(this.recalculatedDate.getFullYear(),
                                       this.recalculatedDate.getMonth(),
                                  this.recalculatedDate.getDate() + daysToAdd);
      this.recalculatedMonth = this.recalculatedDate.getMonth();
      for (let i = 1; i <= 7; i++) {
        let dayOfWeek = this.recalculatedDate.getDate() - this.recalculatedDate.getDay() + i;
        this.weekDays.push(dayOfWeek);
      }
    } else {
      for (let i = 1; i <= 7; i++) {
        let dayOfWeek = this.currentDate.getDate() - this.currentDate.getDay() + i;
        this.weekDays.push(dayOfWeek);
      }
    }
  }

  openModal(editarBorrar:any, cita: IAppointment, i: number, j: number) {
    this.selectedAppointment = cita;
    this.gridIPosition = i;
    this.gridJPosition = j;

    this.modalService.open(editarBorrar).result.then((result) => {
    }, (reason) => {
    });
  }

  openModalCreate(crear:any, i: number, j: number) {
    this.gridIPosition = i;
    this.gridJPosition = j;

    this.modalService.open(crear).result.then((result) => {
    }, (reason) => {
    });
  }

}
