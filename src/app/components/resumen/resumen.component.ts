import { Component } from '@angular/core';
import { Service } from '../service/data.service';
import * as html2pdf from 'html2pdf.js'
import { FormControl, FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ModalMesResumenComponent } from '../modal-mes-resumen/modal-mes-resumen.component';


@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.scss']
})
export class ResumenComponent {
  allData: any;
  filteredData: any;
  totalCost: number = 0;
  mesData: string = '';
  totalOrdenesPdf: number = 0;

  dateForm = new FormGroup({
    fecha: new FormControl()
  })
  constructor(private service: Service, public dialog: MatDialog) {

  }
  ELEMENT_DATA: any = []


  displayedColumns: string[] = ['nameAfiliado', 'cantOrdenes', 'monto', 'acciones'];
  dataSource = new MatTableDataSource<any>
  acciones: any;


  ngOnInit() {
    console.log('iniciando')
  }

  filterDate(date: any) {
    const fechaFactura: any = date;
    return formatDate(fechaFactura, 'MM/yyyy', 'en-US')
  }

  async getAllData() {
    this.allData = await this.service.getAllData();
  }

  async getFilteredData() {
    this.dataSource.data = []
    this.filteredData = await this.service.getFilteredData(this.filterDate(this.dateForm.controls['fecha'].value).toString());

    this.filteredData.forEach(element => {
      let objectToSend = {
        nameAfiliado: element.afiliado.nameAfiliado,
        cantOrdenes: element.afiliado.ordenes.length,
        monto: element.afiliado.importe
      }
      this.dataSource.data.push(objectToSend)
    });
    this.dataSource._updateChangeSubscription();
    this.dataSource.data.forEach(element => {
      console.log(element.cantOrdenes)
      this.totalCost += element.monto
      this.totalOrdenesPdf += element.cantOrdenes
    })

  }


  openDialog() {
    const dialogRef = this.dialog.open(ModalMesResumenComponent, {
      data: { data: this.mesData },
      disableClose: true,
      width: '25em',
      maxHeight: '100vh',
      panelClass: 'no-margin',
      closeOnNavigation: false
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result, 'result')
      this.mesData = result;
      this.downloadPdf()
    });

  }

  async downloadPdf() {
    let element = document.getElementById('table');
    let opt = {
      margin: 1,
      filename: `resumen-${(this.mesData).replace(/\s/g,"-")}`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // New Promise-based usage:
    html2pdf().from(element).set(opt).save();
  }


}
