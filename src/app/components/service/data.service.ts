import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Injectable({
    providedIn: 'root'
})
export class Service {
    constructor(private db: AngularFirestore) {
    }
    getAllUsers() {
        return new Promise<any>((resolve) => {
            this.db.collection('User').valueChanges({ idField: 'id' }).subscribe(users => resolve(users));
        })
    }

    addNewUser(_newId: any, _fName: string, _lName: string, _vip: boolean) {
        this.db.collection("User").doc(_newId).set({ firstName: _fName, lastName: _lName, vipMember: _vip });
    }
}