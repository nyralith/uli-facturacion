import { Component, ElementRef, ViewChild } from '@angular/core';
import { Service } from '../service/data.service';
import * as html2pdf from 'html2pdf.js'
import { FormControl, FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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


  constructor(private service: Service, public dialog: MatDialog, private _snackBar: MatSnackBar) { }

  openSnackBar(message, action) {
    let snackBarRef = this._snackBar.open(message, action, { duration: 5000 });
  }
  displayedColumns: string[] = ['nameAfiliado', 'cantOrdenes', 'monto', 'acciones'];
  dataSourceResumen = new MatTableDataSource<any>
  acciones: any;


  ngOnInit() {
    this.dateForm.reset()
  }

  filterDate(date: any) {
    const fechaFactura: any = date;
    return formatDate(fechaFactura, 'MM/yyyy', 'en-US')
  }

  async getAllData() {
    this.allData = await this.service.getAllData();
  }

  getOrderAmount(order: any) {
    let result = 0
    console.log(order,'order')
    order.forEach(element => {
      result += element.orden.length
    })
    console.log(result, 'result')
    return result;
  }

  async getFilteredData() {
    this.totalCost = 0;
    this.dataSourceResumen.data = []
    this.filteredData = await this.service.getFilteredData(this.filterDate(this.dateForm.controls['fecha'].value).toString());
    console.log(this.filteredData[0])
    this.filteredData.forEach(element => {
      let objectToSend = {
        nameAfiliado: element.afiliado.nameAfiliado,
        cantOrdenes: element.afiliado.ordenes.length,
        monto: element.afiliado.importe
      }
      this.dataSourceResumen.data.push(objectToSend)
    });
    this.dataSourceResumen._updateChangeSubscription();
    this.dataSourceResumen.data.forEach(element => {
      if (!isNaN(element.monto)) {
        this.totalCost += element.monto
      }

      this.totalOrdenesPdf += element.cantOrdenes
      console.log(this.totalOrdenesPdf)
      this.openSnackBar("La operación se realizó con éxito", "X")
    });
  }




  openDialog() {
    const dialogRef = this.dialog.open(ModalMesResumenComponent, {
      data: { data: this.mesData },
      disableClose: false,
      width: '25em',
      maxHeight: '100vh',
      panelClass: 'no-margin',
      closeOnNavigation: false
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.mesData = result;
      this.downloadPdf()
      this.openSnackBar("La descarga se realizó con éxito", "X")
    });
  }


  public downloadPdf() {
  
    let element = document.getElementById('table');

    html2pdf().from(element).set({
      margin: 1,
      filename: `resumen-${(this.mesData).replace(/\s/g, "-")}`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy']
    },
      jsPDF: { unit: 'in', format: 'A4'}
    }).toPdf().get('pdf').then(function (pdf) {
      let totalPages = pdf.internal.getNumberOfPages();

      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.text(`Hoja ${i} de ${totalPages}`, (pdf.internal.pageSize.getWidth() / 2.25), (pdf.internal.pageSize.getHeight() - 0.5));
      }
    }).save();
  }
  }

