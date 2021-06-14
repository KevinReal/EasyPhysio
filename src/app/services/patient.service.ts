import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { IPatient } from "../models/IPatient";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import firebase from "firebase";

@Injectable({
  providedIn: 'root'
})

export class PatientService {

  private patientAngularFirestoreCollection: AngularFirestoreCollection<IPatient> | undefined;

  constructor(private afs: AngularFirestore) { }

  getPatients(): Observable<IPatient[]> {
    this.patientAngularFirestoreCollection = this.afs.collection("patient");
    return this.patientAngularFirestoreCollection.snapshotChanges().pipe(
      map(patients => patients.map(patient=>{
        return patient.payload.doc.data();
      })));
  }

  getPatient(userUid: string): Observable<firebase.firestore.DocumentSnapshot<unknown>> {
    return this.afs.collection("patient").doc(userUid).get();
  }

  createPatient(patientData: IPatient): Promise<void> {
    return this.afs.collection("patient").doc(patientData.uid).set(patientData).then(() => {
      sessionStorage.setItem('user', JSON.stringify(patientData));
    });
  }
}
