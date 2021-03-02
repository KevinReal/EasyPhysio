import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { IAppointment } from "../models/IAppointment";
import { ScheduleService } from "../services/schedule.service"
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {

  numberCols = Array(5);
  numberRowsFirstColumn = Array(4);
  numberRowsGrid = Array(8);

  appointments: IAppointment[][][] = [];

  currentDate = new Date();
  daysOfTheWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  monthsOfTheYear = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                     'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  weekDays: number[] = [];
  recalculatedDate = new Date();
  recalculatedMonth = this.currentDate.getMonth();

  mockSchedule: IAppointment[][][] = [
    [[],[],[],[],[]],
    [[],[],[],[],[]],
    [[],[],[],[],[]],
    [[],[],[],[],[]],
    [[],[],[],[],[]],
    [[],[],[],[],[]],
    [[],[],[],[],[]],
    [[],[],[],[],[]],
    [[],[],[],[],[]],
    [[],[],[],[],[]],
    [[],[],[],[],[]],
    [[],[],[],[],[]],
    [[],[],[],[],[]],
    [[],[],[],[],[]],
    [[],[],[],[],[]],
    [[],[],[],[],[]]
  ];

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
      weeklySchedule =>  {
        this.mockSchedule[0][0].push(weeklySchedule[0]);
        this.mockSchedule[1][1].push(weeklySchedule[1]);
        this.mockSchedule[2][2].push(weeklySchedule[2]);
        this.appointments = this.mockSchedule;
      }
    );
  }

  updateAppointment(appointment: IAppointment): void {
    appointment.treatment.patient.name = 'nombre cambiado!';
    this.scheduleService.updateAppointment(appointment).subscribe(ok => {
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

  deleteAppointment(appointment: IAppointment): void {
    this.scheduleService.deleteAppointment(appointment).subscribe(
      () => this.mockSchedule[this.gridIPosition][this.gridJPosition] =
        this.mockSchedule[this.gridIPosition][this.gridJPosition].filter(h => h !== appointment));
  }

  drop(event: CdkDragDrop<IAppointment[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
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
