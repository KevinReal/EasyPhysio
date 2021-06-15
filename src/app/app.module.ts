import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from "@angular/cdk/drag-drop";
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppointmentsPipe } from './pipes/appointments.pipe';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { CalculateWorkHoursPipe } from './pipes/calculate-work-hours.pipe';
import { ModalComponent } from './modal/modal.component';
import { MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material/dialog";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { ToastContainerComponent } from './toast-container/toast-container.component';
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireModule } from "@angular/fire";
import { environment } from "../environments/environment";
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { MatchPasswordDirective } from "./directives/match-password.directive";
import { PasswordPatternDirective } from "./directives/password-pattern.directive";
import { EmailPatternDirective } from './directives/email-pattern.directive';
import { MatSidenavModule } from "@angular/material/sidenav";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DnipatternDirective } from './directives/dnipattern.directive';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { CheckOtherPhysiosPermissionsPipe } from './pipes/check-other-physios-permissions.pipe';
import { EditAppointmentByLoggedUserPipe } from './pipes/edit-appointment-by-logged-user.pipe';
import { SelectPatientFromListDirective } from './directives/select-patient-from-list.directive';
import { RequiredDateAppointmentDirective } from './directives/required-date-appointment.directive';
import { CheckOtherPatientsPermissionsPipe } from './pipes/check-other-patients-permissions.pipe';
import { APP_INITIALIZER } from '@angular/core';
import { FirebaseAuthService } from "./services/firebase-auth.service";
import { FooterComponent } from './footer/footer.component';
import { AboutUsComponent } from './about-us/about-us.component';

@NgModule({
  declarations: [
    AppComponent,
    SchedulerComponent,
    AppointmentsPipe,
    CalculateWorkHoursPipe,
    ModalComponent,
    ToastContainerComponent,
    LoginComponent,
    SignupComponent,
    MatchPasswordDirective,
    PasswordPatternDirective,
    EmailPatternDirective,
    DnipatternDirective,
    CheckOtherPhysiosPermissionsPipe,
    EditAppointmentByLoggedUserPipe,
    SelectPatientFromListDirective,
    RequiredDateAppointmentDirective,
    CheckOtherPatientsPermissionsPipe,
    FooterComponent,
    AboutUsComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        BrowserAnimationsModule,
        DragDropModule,
        HttpClientModule,
        FormsModule,
        MatDatepickerModule,
        MatInputModule,
        MatMomentDateModule,
        MatCheckboxModule,
        AngularFirestoreModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        MatSidenavModule,
        FontAwesomeModule,
        MatOptionModule,
        MatAutocompleteModule,
        MatTooltipModule,
        MatSelectModule
    ],
  providers: [AppointmentsPipe,
              {provide: MAT_DATE_LOCALE, useValue: 'es_ES'},
              {provide: MAT_DIALOG_DEFAULT_OPTIONS,
                useValue: {
                  height: "80vh",
                  width: "70vw",
                  hasBackdrop: true
                }
              },
              {
                provide: APP_INITIALIZER,
                useFactory: resourceProviderFactory,
                deps: [FirebaseAuthService],
                multi: true
              }],
  bootstrap: [AppComponent]
})

export class AppModule { }

export function resourceProviderFactory(firebaseAuthService: FirebaseAuthService) {
  return () => firebaseAuthService.checkPersistedLogin();
}
