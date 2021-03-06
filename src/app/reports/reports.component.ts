import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppointmentService } from "../services/appointment.service";
import { PhysioService } from "../services/physio.service";
import { IPhysio } from "../models/IPhysio";
import {debounceTime, distinctUntilChanged, filter, take, tap} from "rxjs/operators";
import { PatientService } from "../services/patient.service";
import { IPatient } from "../models/IPatient";
import { FirebaseAuthService } from "../services/firebase-auth.service";
import { RoomService } from "../services/room.service";
import { IRoom } from "../models/IRoom";
import { chain, groupBy} from "lodash";
import {fromEvent} from "rxjs";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})

export class ReportsComponent implements OnInit, AfterViewInit {
  // @ts-ignore
  @ViewChild('input', {static: true}) input: ElementRef;

  physios!: IPhysio[];
  patients!: IPatient[];
  rooms!: IRoom[];
  view: [number, number] = [900, 400];
  noBarWhenZero = false;
  animations = true;
  legend = true;


  appointmentsByPhysioAndRangeOfDates: any[] = [];
  colorSchemeVerticalBar = {
    domain: [] as string[]
  };
  showXAxisVerticalBar = true;
  showYAxisVerticalBar = true;
  showXAxisLabelVerticalBar = true;
  xAxisLabelVerticalBar = 'Fisioterapeutas';
  showYAxisLabelVerticalBar = true;
  yAxisLabelVerticalBar = 'Citas';
  legendTitleVerticalBar = 'Fisioterapeutas';
  weeksToAddVerticalBar = [0, 3, 51];
  labelsRadioButtonVerticalBar = ['Semana actual', 'Último mes', 'Último año'];


  appointmentsByPhysioAndDay: any[] = [];
  daysOfTheWeek = [0,1,2,3,4];
  labelDaysOfTheWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  colorSchemeMultipleVerticalBar = {
    domain: [] as string[]
  };
  showXAxisMultipleVerticalBar = true;
  showYAxisMultipleVerticalBar = true;
  showXAxisLabelMultipleVerticalBar = true;
  xAxisLabelMultipleVerticalBar = 'Días de la semana : ' + this.firebaseAuthService.getFullName();
  showYAxisLabelMultipleVerticalBar= true;
  yAxisLabelMultipleVerticalBar = 'Citas';
  legendTitleMultipleVerticalBar = 'Semanas';
  weeksToAddMultipleVerticalBar = [0, 1];
  labelsCheckboxMultipleVerticalBar = ['Semana actual', 'Semana pasada'];


  appointmentsByInjuriesAndDates: any[] = [];
  cardColor = '#232837';
  textColor = '#fff';
  colorSchemeNumberCard = {
    domain: ['#654321'] as string[]
  };
  weeksToAddNumberCard = [0, 3, 51];
  labelsRadioButtonNumberCard = ['Semana actual', 'Último mes', 'Último año'];
  limitInjuriesToShow = 3;


  appointmentsByRoomAndRangeOfDates: any[] = [];
  colorSchemeGauge = {
    domain: ['#63208A', '#0013A1','#A80907', '#2C5F73', '#000']
  };
  maxGauge = 10;
  angleSpanGauge = 180;
  startAngleGauge = -90;
  legendTitleGauge = 'Salas (Nº)';
  innerLegend = 'Citas (centro)';
  weeksToAddGauge = [0, 3, 51];
  labelsRadioButtonGauge = ['Semana actual', 'Último mes', 'Último año'];


  constructor(private appointmentService: AppointmentService,
              private physioService: PhysioService,
              private patientService: PatientService,
              private roomService: RoomService,
              private firebaseAuthService: FirebaseAuthService) {
  }

  ngOnInit() {
    this.physioService.getPhysios().pipe(take(1)).subscribe(physios => {
      this.physios = physios;
      this.physios.sort(function(a, b) {
        if (a.fullName > b.fullName) return -1;
        if (a.fullName < b.fullName) return 1;
        return 0;
      });
      this.getAppointmentsByPhysioAndRangeOfDates(0);
    });
    this.patientService.getPatients().pipe(take(1)).subscribe(patients => {
      this.patients = patients;
      this.getAppointmentsByInjuriesAndRangeOfDates(0);
    });
    this.roomService.getRooms().pipe(take(1)).subscribe(rooms => {
      this.rooms = rooms;
      this.getAppointmentsByRoomAndRangeOfDates(0);
    });
    this.getAppointmentsByPhysioAndDay(0);
    this.colorSchemeMultipleVerticalBar.domain.push(this.firebaseAuthService.getColor());
    this.colorSchemeMultipleVerticalBar.domain.push('#000');
  }

  ngAfterViewInit() {
    fromEvent(this.input.nativeElement,'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(1500),
        // @ts-ignore
        distinctUntilChanged(),
        tap((event:KeyboardEvent) => {
          this.limitInjuriesToShow = this.input.nativeElement.value;
        })
      )
      .subscribe();
  }

  getAppointmentsByPhysioAndRangeOfDates(weekMultiplier: number) {
    this.appointmentsByPhysioAndRangeOfDates = [];
    this.physios.forEach(physio => {
      this.colorSchemeVerticalBar.domain.push(physio.color)
      this.appointmentService.getAppointmentsByPhysioAndRangeOfDates(physio.dni, weekMultiplier)
        .valueChanges()
        .pipe(take(1))
        .subscribe(appointmentsByPhysioAndRangeOfDates => {
          const value = {
            "name" : physio.fullName,
            "value" : appointmentsByPhysioAndRangeOfDates.length
          };
          this.appointmentsByPhysioAndRangeOfDates.push(value);
          this.appointmentsByPhysioAndRangeOfDates = [...this.appointmentsByPhysioAndRangeOfDates];
        })
    })
  }

  getAppointmentsByPhysioAndDay(weekMultiplier: number) {
    this.appointmentsByPhysioAndDay = [];
    for (let i = 0; i < this.daysOfTheWeek.length; i++) {
      this.appointmentService.getAppointmentsByPhysioAndDay(this.firebaseAuthService.getPhysioDNI(),
        this.daysOfTheWeek[i],
        0)
        .valueChanges()
        .pipe(take(1))
        .subscribe(appointmentsByPhysioAndDay => {
          if (weekMultiplier === 0) {
            const value = {
              "name" : this.labelDaysOfTheWeek[i],
              "series" : [
                {
                  "name" : 'Semana actual',
                  "value" : appointmentsByPhysioAndDay.length
                }
              ]
            };
            this.appointmentsByPhysioAndDay.push(value);
            this.appointmentsByPhysioAndDay = [...this.appointmentsByPhysioAndDay];
          } else if (weekMultiplier === 1) {
            const value = {
              "name" : this.labelDaysOfTheWeek[i],
              "series" : [
                {
                  "name" : 'Semana actual',
                  "value" : appointmentsByPhysioAndDay.length
                },
                {
                  "name" : 'Semana pasada',
                  "value" : appointmentsByPhysioAndDay.length + i
                }
              ]
            };
            this.appointmentsByPhysioAndDay.push(value);
            this.appointmentsByPhysioAndDay = [...this.appointmentsByPhysioAndDay];
          }
        })
    }
  }

  getAppointmentsByInjuriesAndRangeOfDates(weekMultiplier: number) {
    this.appointmentsByInjuriesAndDates = [];
    this.appointmentService.getAppointmentsByInjuriesAndRangeOfDates(weekMultiplier)
      .valueChanges()
      .pipe(take(1))
      .subscribe(appointmentsByInjuriesAndDates => {
        const appointments = chain(appointmentsByInjuriesAndDates)
          .groupBy("reasonAppointment")
          .map((value, key) => ({ injury: key, appointments: value }))
          .value();

        appointments.forEach(appointment => {
          const value = {
            "name" : appointment.injury,
            "value" : appointment.appointments.length
          };
          this.appointmentsByInjuriesAndDates.push(value);
        })

        this.appointmentsByInjuriesAndDates.sort(function(a, b) {
          if (a.value > b.value) return -1;
          if (a.value < b.value) return 1;
          return 0;
        });
        this.appointmentsByInjuriesAndDates = [...this.appointmentsByInjuriesAndDates];
      })
  }

  getAppointmentsByRoomAndRangeOfDates(weekMultiplier: number) {
    this.appointmentsByRoomAndRangeOfDates = [];
    this.rooms.forEach(room => {
      this.appointmentService.getAppointmentsByRoomAndRangeOfDates(room.id, weekMultiplier)
        .valueChanges()
        .pipe(take(1))
        .subscribe(appointmentsByRoomAndDates => {
          const value = {
            "name" : room.name + ' (' + room.number + ')',
            "value" : appointmentsByRoomAndDates.length,
            "number": room.number
          };
          if (appointmentsByRoomAndDates.length > this.maxGauge) {
            this.maxGauge = appointmentsByRoomAndDates.length;
          }
          this.appointmentsByRoomAndRangeOfDates.push(value);
          this.appointmentsByRoomAndRangeOfDates.sort(function(a, b) {
            if (a.number < b.number) return -1;
            if (a.number > b.number) return 1;
            return 0;
          });
          this.appointmentsByRoomAndRangeOfDates = [...this.appointmentsByRoomAndRangeOfDates];
        })
    })
  }

}
