import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from "@angular/cdk/drag-drop";
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './services/in-memory-data.service';
import { FormsModule } from '@angular/forms';
import { AppointmentsPipe } from './pipes/appointments.pipe';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { CalculateWorkHoursPipe } from './pipes/calculate-work-hours.pipe';
import { ModalComponent } from './modal/modal.component';
import { MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material/dialog";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { ToastContainerComponent } from './toast-container/toast-container.component';

@NgModule({
  declarations: [
    AppComponent,
    SchedulerComponent,
    AppointmentsPipe,
    CalculateWorkHoursPipe,
    ModalComponent,
    ToastContainerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    DragDropModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, {dataEncapsulation: false}
    ),
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatMomentDateModule,
    MatCheckboxModule
  ],
  providers: [AppointmentsPipe,
              {provide: MAT_DATE_LOCALE, useValue: 'es_ES'},
              {provide: MAT_DIALOG_DEFAULT_OPTIONS,
                useValue: {
                  height: "80vh",
                  width: "70vw",
                  hasBackdrop: true
                }
              }],
  bootstrap: [AppComponent]
})

export class AppModule { }
