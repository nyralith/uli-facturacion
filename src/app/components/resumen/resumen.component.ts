import { Component } from '@angular/core';
import { Service } from '../service/data.service';
import * as html2pdf from 'html2pdf.js'
import { timestamp } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.scss']
})
export class ResumenComponent {
  allData: any;
  filteredData: any;

  dateForm = new FormGroup({
    fecha: new FormControl()
  })
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


  async ngOnInit() {
    this.getAllData()
    // el +1 en getmonth porque los meses comienzan en 0
    // console.log(this.ELEMENT_DATA[0].fecha.getDate(), this.ELEMENT_DATA[0].fecha.getMonth() + 1, this.ELEMENT_DATA[0].fecha.getFullYear())
    // console.log(new Date().getMonth())
  }



  async getAllData() {
    this.allData = await this.service.getAllData();
    let date = this.allData[0].afiliado.fecha
    console.log(new Date(date.seconds * 1000))
  }

  async getFilteredData() {
    this.filteredData = await this.service.getFilteredData(this.dateForm.controls['fecha'].value)
    console.log(this.filteredData);
    // console.log(this.dateForm.controls['fecha'].value)
    // this.service.getFilteredData(this.dateForm.controls['fecha'].value);
  }

  // filterDate(date: any) {
  //   const fechaFactura: any = date.toString()
  //   formatDate(fechaFactura, 'dd/MM/yyyy', 'en-EU')
  //   console.log(formatDate(fechaFactura, 'dd/MM/yyyy', 'en-EU'))
  // }

  downloadPdf() {
    let element = document.getElementById('table');
    let opt = {
      margin: 1,
      filename: 'resumen.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // New Promise-based usage:
    html2pdf().from(element).set(opt).save();
  }


}

