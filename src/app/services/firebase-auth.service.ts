import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import firebase from "firebase";
import { flatMap } from "rxjs/internal/operators";

@Injectable({
  providedIn: 'root'
})

export class FirebaseAuthService {

  userUid = '';

  constructor(private firebaseAuth: AngularFireAuth,
              private router: Router) { }

  signUp(email:string, password: string): Promise<void> {
    return this.firebaseAuth.createUserWithEmailAndPassword(email, password).then(res => {
      if (res.user) {
        this.userUid = res.user.uid;
      }
    });
  }

  signIn(email: string, password: string): ReturnType<firebase.auth.Auth["signInWithEmailAndPassword"]> {
    return this.firebaseAuth.signInWithEmailAndPassword(email, password);
  }

  logout(): void {
    this.firebaseAuth.signOut().then(() => {
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      this.userUid = '';
      this.router.navigate(['/login']).then();
    });
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('user');
  }

  getPhysioDNI(): string {
    if (this.isLoggedIn()){
      return JSON.parse(<string>sessionStorage.getItem('user')).dni
    }
    return '';
  }

  getPatientUid(): string {
    if (this.isLoggedIn()){
      return JSON.parse(<string>sessionStorage.getItem('user')).uid
    }
    return '';
  }

  // @ts-ignore
  getOtherPhysiosPermissions(): flatMap<string, string[]> {
    return JSON.parse(<string>sessionStorage.getItem('user')).otherPhysiosPermissions;
  }

  // @ts-ignore
  getOtherPatientsPermissions(): flatMap<string, string[]> {
    return JSON.parse(<string>sessionStorage.getItem('user')).otherPatientsPermissions;
  }

  getDefaultPhysio(): string {
    return JSON.parse(<string>sessionStorage.getItem('user')).defaultPhysio;
  }

  getEmail(): string {
    return JSON.parse(<string>sessionStorage.getItem('user')).email;
  }

  getColor(): string {
    return JSON.parse(<string>sessionStorage.getItem('user')).color;
  }

  getFullName(): string {
    return JSON.parse(<string>sessionStorage.getItem('user')).fullName;
  }

  checkPersistedLogin() {
    if (!!localStorage.getItem('user')) {
      sessionStorage.setItem('user', <string>localStorage.getItem('user'));
    }
  }

}
