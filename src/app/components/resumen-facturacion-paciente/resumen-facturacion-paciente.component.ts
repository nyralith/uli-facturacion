import { formatDate } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as html2pdf from 'html2pdf.js'
import { Service } from '../service/data.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalMesResumenComponent } from '../modal-mes-resumen/modal-mes-resumen.component';
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';


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
  displayedColumns: string[] = ['numAfiliado', 'nameAfiliado', 'codigo', 'analisis', 'importe'];
  acciones: any;
  mesData: any;
  diaData: any;
  dataArray: any = [];
  totalCost: number = 0;
  paciente: any

  filterForm = new FormGroup({
    nameAfiliado: new FormControl('', Validators.required),
    fechaFactura: new FormControl('', Validators.required),
  })

  constructor(private service: Service, public dialog: MatDialog, private _snackBar: MatSnackBar) {

  }

  openSnackBar(message, action) {
    // let snackBarRef = this._snackBar.open(message, action, { duration: 2000 });
    let snackBarRef = this._snackBar.open(message, action, { duration: 5000 });
  }



  filterDate(date: any) {
    const fechaFactura: any = date;
    return formatDate(fechaFactura, 'MM/yyyy', 'en-US')
  }

  async getAllData() {

    this.allData = await this.service.getAllData();
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

  async getFilteredData() {
    this.diaData = this.filterForm.controls['fechaFactura'].value;
    this.filteredData = []
    this.dataArray = []
    this.totalCost = 0;
    this.filteredData = await this.service.getFilteredFactura((this.filterDate(this.filterForm.controls['fechaFactura'].value).toString()), this.filterForm.controls['nameAfiliado'].value);

    this.filteredData.forEach(element => {
      const data = {
        numAfiliado: element.afiliado.numAfiliado,
        nameAfiliado: element.afiliado.nameAfiliado,
        fecha: element.afiliado.fecha,
        importe: element.afiliado.importe,
        ordenes: element.afiliado.ordenes
      };
      if (!isNaN(element.afiliado.importe)) {
        this.totalCost += element.afiliado.importe;
      }

      this.dataArray.push(data);
      this.openSnackBar("La operación se realizó con éxito", "X")
    });

  }


  // downloadPdf() {
  //   let element = document.getElementById('table');

  //   html2pdf().from(element).set({
  //     margin: 1,
  //     filename: `resumen-${(this.mesData).replace(/\s/g, "-")}-${(this.filterForm.controls['nameAfiliado'].value)}`,
  //     image: { type: 'jpeg', quality: 0.98 },
  //     html2canvas: { scale: 2 },
  //     pageBreak: { mode: 'css', before: '#nextpage1' },
  //     jsPDF: { unit: 'in', format: 'a4' }
  //   }).toPdf().get('pdf').then(function (pdf) {
  //     let totalPages = pdf.internal.getNumberOfPages();

  //     for (let i = 1; i <= totalPages; i++) {
  //       pdf.setPage(i);
  //       pdf.setFontSize(10);
  //       pdf.setTextColor(150);
  //       pdf.text('Hoja ' + i + ' de ' + totalPages, (pdf.internal.pageSize.getWidth() / 2.25), (pdf.internal.pageSize.getHeight() - 8));
  //     }
  //   }).save();
  // }

  @ViewChild('pdfTable') pdfTable: ElementRef;
  
  public downloadPdf() {
    const doc = new jsPDF();
   
    const pdfTable = this.pdfTable.nativeElement;
   
    let html = htmlToPdfmake(pdfTable.innerHTML);
     
    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).open(); 
     




  downloadPdf() {
    let element = document.getElementById('table');

    html2pdf().from(element).set({
      margin: 0.5,
      filename: `resumen-${(this.mesData).replace(/\s/g, "-")}-${(this.filterForm.controls['nameAfiliado'].value)}`,
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
        pdf.text(`Hoja ${i} de ${totalPages}`, (pdf.internal.pageSize.getWidth() / 2.25), (pdf.internal.pageSize.getHeight() - 0.2));
      }
    }).save();
  }

}