import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collection, query, where } from 'firebase/firestore';


@Injectable({
    providedIn: 'root'
})

export class Service {
    constructor(private db: AngularFirestore) {
    }




    getAllData() {
        return new Promise<any>((resolve) => {
            this.db.collection('facturas').valueChanges({ idField: 'id' }).subscribe(users => resolve(users));
        })
    }
    async getFilteredData(filtro: any) {
        return new Promise<any>((resolve) => {
            this.db.collection('facturas', ref => ref.where('afiliado.fecha', '==', filtro)).valueChanges().subscribe(resolve);
        })

    }
    async addNewUser(_newId: any, afiliado: any) {
        await this.db.collection("facturas").doc(_newId).set({ afiliado });
    }
}