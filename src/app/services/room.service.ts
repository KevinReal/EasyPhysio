import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { IRoom } from "../models/IRoom";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class RoomService {

  private roomAngularFirestoreCollection: AngularFirestoreCollection<IRoom> | undefined;

  constructor(private afs: AngularFirestore) { }

  getRooms(): Observable<IRoom[]> {
    this.roomAngularFirestoreCollection = this.afs.collection("room");
    return this.roomAngularFirestoreCollection.snapshotChanges().pipe(
      map(rooms => rooms.map(room =>{
        return room.payload.doc.data();
      })));
  }
}
