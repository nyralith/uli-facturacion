import { Component } from '@angular/core';
import { Service } from '../service/data.service';
import * as html2pdf from 'html2pdf.js'
import { FormControl, FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';


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
  }

  filterDate(date: any) {
    const fechaFactura: any = date;
    return formatDate(fechaFactura, 'MM/yyyy', 'en-US')
  }

  async getAllData() {
    this.allData = await this.service.getAllData();
    console.log(this.allData[0])
  }

  async getFilteredData() {
    this.filteredData = await this.service.getFilteredData(this.filterDate(this.dateForm.controls['fecha'].value).toString());

    console.log(this.filterDate(this.dateForm.controls['fecha'].value).toString())
    console.log(this.filteredData);
  }

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

