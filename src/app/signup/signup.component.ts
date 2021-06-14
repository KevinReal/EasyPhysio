import { Component } from '@angular/core';
import { FirebaseAuthService } from "../services/firebase-auth.service";
import { Router } from "@angular/router";
import { ToastService } from "../services/toast.service";
import { PatientService } from "../services/patient.service";
import { IPatient } from "../models/IPatient";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent {

  fullNameSignUp = '';
  emailSignUp = '';
  passwordSignUp = '';
  repeatPasswordSignUp = '';
  accountAlreadyUsed = false;

  constructor(private firebaseAuth: FirebaseAuthService,
              private router: Router,
              private toastService: ToastService,
              private patientService: PatientService) { }

  onSignUp(): void {
    this.accountAlreadyUsed = false;
    this.firebaseAuth.signUp(this.emailSignUp, this.passwordSignUp).then(() => {
      const newPatient: IPatient = {
        uid: this.firebaseAuth.userUid,
        fullName: this.fullNameSignUp,
        email: this.emailSignUp
      }
      this.patientService.createPatient(newPatient).then(() => {
        this.router.navigate(['/agenda']).then();
      }).catch(() => {
        this.toastService.show('Se ha producido un error. Inténtelo más tarde.', { classname: 'toast-warn', delay: 10000})
      });
    }).catch((err) => {
      if (err?.code === 'auth/email-already-in-use') {
        this.accountAlreadyUsed = true;
      }
    });
  }

}
