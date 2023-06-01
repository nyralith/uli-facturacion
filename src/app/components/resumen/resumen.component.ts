import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { Service } from '../service/data.service';


const saveComponents: any = [{
  getDate: Number,
  getMonth: Number,
  getFullYear: Number,
}]

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.scss']
})
export class ResumenComponent {
  allData: any
  constructor(private service: Service) {

  }
  ELEMENT_DATA: any = [
    {
      numAfi: 1,
      nombAfi: "ROBERT",
      codigo: 123456,
      analisisRealizados: "ANAL",
      fecha: new Date(),
      importe: 900,
    }
  ];

  displayedColumns: string[] = ['numAfi', 'nombAfi', 'codigo', 'analisisRealizados', 'importe', 'fecha', 'acciones'];
  // dataSource = new MatTableDataSource<any>;
  dataSource = this.ELEMENT_DATA;
  acciones: any;


  ngOnInit() {
    console.log('hola chike')
    // el +1 en getmonth porque los meses comienzan en 0
    console.log(this.ELEMENT_DATA[0].fecha.getDate(), this.ELEMENT_DATA[0].fecha.getMonth() + 1, this.ELEMENT_DATA[0].fecha.getFullYear())
    console.log(new Date().getMonth())



    this.service.addNewUser("62289836", "Jane", "Doe", true);



    this.getUsers()

  }


  async getUsers() {
    this.allData = await this.service.getAllUsers();
    console.log(this.allData);
  }

  // filterDate(date: any) {
  //   const fechaFactura: any = date.toString()
  //   formatDate(fechaFactura, 'dd/MM/yyyy', 'en-EU')
  //   console.log(formatDate(fechaFactura, 'dd/MM/yyyy', 'en-EU'))
  // }
  getDate() {
    console.log('getDate')
  }

  downloadPdf() {
    console.log('downloadPdf')
  }

}

