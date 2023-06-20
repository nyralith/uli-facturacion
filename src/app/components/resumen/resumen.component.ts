import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import * as html2pdf from 'html2pdf.js'


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
    console.log(this.ELEMENT_DATA[0].fecha.getDate(), this.ELEMENT_DATA[0].fecha.getMonth()+1, this.ELEMENT_DATA[0].fecha.getFullYear() )
    console.log(new Date().getMonth())
  }

  // filterDate(date: any) {
  //   const fechaFactura: any = date.toString()
  //   formatDate(fechaFactura, 'dd/MM/yyyy', 'en-EU')
  //   console.log(formatDate(fechaFactura, 'dd/MM/yyyy', 'en-EU'))
  // }
  getDate() {
    console.log('getDate')
  }

  downloadPdf(){
    var element = document.getElementById('table');
var opt = {
  margin:       1,
  filename:     'output.pdf',
  image:        { type: 'jpeg', quality: 0.98 },
  html2canvas:  { scale: 2 },
  jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
};
 
// New Promise-based usage:
html2pdf().from(element).set(opt).save();
  }


}

