import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  filteredData: any;
  dateForm: any;
  dataSource = new MatTableDataSource<any>
  displayedColumns: string[] = ['nameAfiliado', 'cantOrdenes', 'monto', 'acciones'];
  acciones: any;

  filterForm = new FormGroup({
    nameAfiliado: new FormControl('', Validators.required),
    fechaFactura: new FormControl('', Validators.required),
  })

  constructor(private service: Service) {

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
    console.log('entrando')
    console.log(this.filterForm.controls['nameAfiliado'].value)
    
    this.filteredData = await this.service.getFilteredFactura((this.filterDate(this.filterForm.controls['fechaFactura'].value).toString()), this.filterForm.controls['nameAfiliado'].value);
    this.ELEMENT_DATA = this.filteredData
    console.log(this.ELEMENT_DATA)
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
