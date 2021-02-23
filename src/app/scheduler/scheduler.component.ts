import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { IAppointment } from "../models/IAppointment";
import { ScheduleService } from "../services/schedule.service"

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {

  numberCols = Array(5);
  numberRowsFirstColumn = Array(4);
  numberRowsGrid = Array(8);
  citas: IAppointment[][][] = [];

  constructor(private scheduleService: ScheduleService) { }

  ngOnInit() {
    this.scheduleService.getScheduleByPyshioAndRangeOfDates('', new Date(), new Date()).subscribe(
      weeklySchedule => this.citas = weeklySchedule.weeklySchedule
    );
  }

  drop(event: CdkDragDrop<IAppointment[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

}
