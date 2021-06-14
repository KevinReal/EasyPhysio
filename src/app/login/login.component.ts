import { Component } from '@angular/core';
import { FirebaseAuthService } from '../services/firebase-auth.service'
import { Router } from '@angular/router';
import { ToastService } from "../services/toast.service"
import { PatientService } from "../services/patient.service";
import { PhysioService } from "../services/physio.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {

  emailSignIn = '';
  passwordSignIn = '';
  dniSignIn = '';

  noUserCreated = false;
  wrongPassword = false;
  userNotPhysio = false;
  wrongDNI = false;

  isPhysio = false;
  rememberMe = false;

  constructor(private firebaseAuth: FirebaseAuthService,
              private router: Router,
              private toastService: ToastService,
              private patientService: PatientService,
              private physioService: PhysioService) { }

  onSignIn(): void {
    this.noUserCreated = false;
    this.wrongPassword = false;
    this.userNotPhysio = false;
    this.wrongDNI = false;

    this.firebaseAuth.signIn(this.emailSignIn, this.passwordSignIn).then((res) => {
      if (res.user) {
        if (this.isPhysio) {
          this.physioService.getPhysio(res.user.uid).subscribe(physio => {
            if (physio.data()) {
              // @ts-ignore
              if (this.dniSignIn === physio.data().dni) {
                if (this.rememberMe) {
                  localStorage.setItem('user', JSON.stringify(physio.data()));
                }
                sessionStorage.setItem('user', JSON.stringify(physio.data()));
                this.router.navigate(['/agenda']).then();
              } else {
                this.wrongDNI = true;
              }
            } else {
              this.userNotPhysio = true;
            }
          }, () => this.toastService.show('Se ha producido un error. Inténtelo más tarde.', { classname: 'toast-warn', delay: 10000}));

        } else {
          this.patientService.getPatient(res.user.uid).subscribe(patient => {
            if (patient) {
              if (this.rememberMe) {
                localStorage.setItem('user', JSON.stringify(patient.data()));
              }
              sessionStorage.setItem('user', JSON.stringify(patient.data()));
              this.router.navigate(['/agenda']).then();
            }
          }, () => this.toastService.show('Se ha producido un error. Inténtelo más tarde.', { classname: 'toast-warn', delay: 10000}));
        }
      }
    }).catch((err) => {
      if (err?.code === 'auth/user-not-found') {
        this.noUserCreated = true;
      } else if (err?.code === 'auth/wrong-password') {
        this.wrongPassword = true;
      }
    });
  }

  changeIsPhysio(): void {
    this.isPhysio = !this.isPhysio;
  }

  changeRememberMe(): void {
    this.rememberMe = !this.rememberMe;
  }

}
