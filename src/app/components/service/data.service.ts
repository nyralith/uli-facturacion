import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collection, query, where } from 'firebase/firestore';



@Injectable({
    providedIn: 'root'
})

export class Service {


    isUli: boolean;
    isMama: boolean;


    constructor(private db: AngularFirestore,) {


    }




    getAllData() {
        if (this.isUli) {
            return new Promise<any>((resolve) => {
                this.db.collection('facturas').valueChanges({ idField: 'id' }).subscribe(users => resolve(users));
            })
        }
        else if (this.isMama) {
            return new Promise<any>((resolve) => {
                this.db.collection('facturasMami').valueChanges({ idField: 'id' }).subscribe(users => resolve(users));
            })
        }
        else {
            return
        }
    }
    async getFilteredData(filtro: any, obraSocial: any) {
        if (this.isUli) {
            return new Promise<any>((resolve) => {
                this.db.collection('facturas', ref => ref.where('afiliado.fecha', '==', filtro)).valueChanges().subscribe(resolve);
            })
        } else if (this.isMama) {
            return new Promise<any>((resolve) => {
                this.db.collection('facturasMami', ref => ref.where('afiliado.fecha', '==', filtro).where('afiliado.obraSocial', '==', obraSocial)).valueChanges().subscribe(resolve);
            })
        }
        else {
            return
        }
    }

    async getFilteredFactura(filtro: any, nombreAfiliado: any) {
        if (this.isUli) {
            return new Promise<any>((resolve) => {
                this.db.collection('facturas', ref => ref.where('afiliado.fecha', '==', filtro).where('afiliado.nameAfiliado', '==', nombreAfiliado)).valueChanges().subscribe(resolve)
            })
        } else if (this.isMama) {
            return new Promise<any>((resolve) => {
                this.db.collection('facturasMami', ref => ref.where('afiliado.fecha', '==', filtro).where('afiliado.nameAfiliado', '==', nombreAfiliado)).valueChanges().subscribe(resolve)
            })
        }
        else {
            return
        }
    }
    async addOrders(_newId: any, afiliado: any, collection: string) {
        await this.db.collection(collection).doc(_newId).set({ afiliado });
    }
}