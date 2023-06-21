import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as html2pdf from 'html2pdf.js'
import { Service } from '../service/data.service';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-resumen-facturacion-paciente',
  templateUrl: './resumen-facturacion-paciente.component.html',
  styleUrls: ['./resumen-facturacion-paciente.component.scss']
})
export class ResumenFacturacionPacienteComponent {
  allData: any;
  service: any;
  filteredData: any;
  dateForm: any;
  dataSource = new MatTableDataSource<any>
  displayedColumns: string[] = ['nameAfiliado', 'cantOrdenes', 'monto', 'acciones'];
  acciones: any;


  constructor(private services: Service) {

  }

  ELEMENT_DATA: any = [
    {
      nameAfiliado: 'DEVORA MELTROZO',
      cantOrdenes: '6',
      monto: '90.000',
    },
    {
      nameAfiliado: 'Digger Nick',
      cantOrdenes: '3',
      monto: '67.000',
    },
    {
      nameAfiliado: 'Knee Gurr',
      cantOrdenes: '32',
      monto: '11.596',
    }
  ]


  async ngOnInit() {
    this.getAllData()
  }

  filterDate(date: any) {
    this.allData
    this.filteredData

    this.dateForm = new FormGroup({
      fecha: new FormControl()
    })




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

    this.ELEMENT_DATA = this.filteredData
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
