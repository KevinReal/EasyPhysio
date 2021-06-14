import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { map } from "rxjs/operators";
import { IPhysio } from "../models/IPhysio";
import { Observable } from "rxjs";
import firebase from "firebase";

@Injectable({
  providedIn: 'root'
})

export class PhysioService {

  private physioAngularFirestoreCollection: AngularFirestoreCollection<IPhysio> | undefined;

  constructor(private afs: AngularFirestore) { }

  getPhysios(): Observable<IPhysio[]> {
    this.physioAngularFirestoreCollection = this.afs.collection("physio");
    return this.physioAngularFirestoreCollection.snapshotChanges().pipe(
      map(physios => physios.map(physio =>{
        return physio.payload.doc.data();
      })));
  }

  getPhysio(userUid: string): Observable<firebase.firestore.DocumentSnapshot<unknown>> {
    return this.afs.collection("physio").doc(userUid).get();
  }

}
