import { Component, ElementRef, ViewChild } from '@angular/core';
import { Service } from '../service/data.service';
import * as html2pdf from 'html2pdf.js'
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  dateForm = new FormGroup({
    fecha: new FormControl('', Validators.required),
    obraSocial: new FormControl(),
  })
  filterForm = new FormGroup({
    fechaFactura: new FormControl('', Validators.required),
    obraSocial: new FormControl('', Validators.required)
  })

  isUli: boolean;
  isMama: boolean;
  selectedObraSocial: any
  allData: any;
  filteredData: any;
  totalCost: number = 0;
  mesData: string = '';
  sanatorioData: string = '';
  totalOrdenesPdf: number = 0;
  dataArray: any = [];
  diaData: any;



  constructor(private service: Service, public dialog: MatDialog, private _snackBar: MatSnackBar) {
    this.isUli = this.service.isUli
    this.isMama = this.service.isMama
  }

  openSnackBar(message, action) {
    let snackBarRef = this._snackBar.open(message, action, { duration: 5000 });
  }

  displayedColumns: string[] = ['nameAfiliado', 'cantOrdenes', 'monto', 'acciones'];
  dataSourceResumen = new MatTableDataSource<any>


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
    order.forEach(element => {
      result += element.orden.length
    })
    return result;
  }
  async getFilteredData() {
    this.diaData = this.filterForm.controls['fechaFactura'].value;
    this.filteredData = []
    this.dataArray = []
    this.totalCost = 0;
    this.dataSourceResumen.data = []
    if (this.isUli) {
      this.filteredData = await this.service.getFilteredData(this.filterDate(this.dateForm.controls['fecha'].value).toString(), (this.dateForm.controls['obraSocial'].value));
      this.filteredData.forEach(element => {
        console.log(element)
        let objectToSend = {
          nameAfiliado: element.afiliado.nameAfiliado,
          cantOrdenes: element.afiliado.ordenes.length,
          monto: element.afiliado.importe
        }
        this.dataSourceResumen.data.push(objectToSend)
      });
      let sortedData = this.dataSourceResumen.data.sort((a: any, b: any) => {
        let fa = a.nameAfiliado.toLowerCase(),
          fb = b.nameAfiliado.toLowerCase();
        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      })
      this.dataSourceResumen.data = sortedData
      this.dataSourceResumen._updateChangeSubscription();
      this.dataSourceResumen.data.forEach(element => {
        if (!isNaN(element.monto)) {
          this.totalCost += element.monto
        }
        this.totalOrdenesPdf += element.cantOrdenes
        this.openSnackBar("La operación se realizó con éxito", "X")
      });
    } else {
      this.filteredData = await this.service.getFilteredData((this.filterDate(this.filterForm.controls['fechaFactura'].value?.toString())), (this.filterForm.controls['obraSocial'].value));
      this.filteredData.forEach(element => {
        console.log(element)
        let object = {
          numAfiliado: element.afiliado.numAfiliado,
          nameAfiliado: element.afiliado.nameAfiliado,
          fecha: element.afiliado.fecha,
          importe: element.afiliado.importe,
          ordenes: element.afiliado.ordenes,
          numOrden: element.afiliado.numOrden,
        }
        if (!isNaN(element.afiliado.importe)) {
          this.totalCost += element.afiliado.importe;
        }

        this.dataArray.push(object);
        this.openSnackBar("La operación se realizó con éxito", "X")
      });
      let sortedData = this.dataArray.sort((a: any, b: any) => {
        let fa = a.nameAfiliado.toLowerCase(),
          fb = b.nameAfiliado.toLowerCase();
        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      })
      this.dataArray = sortedData
    }

  }




  openDialog() {
    const dialogRef = this.dialog.open(ModalMesResumenComponent, {
      data: { data: this.mesData, sanatorio: this.sanatorioData },
      disableClose: false,
      width: '35em',
      maxHeight: '100vh',
      panelClass: 'no-margin',
      closeOnNavigation: false
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.mesData = result.data;
      this.sanatorioData = result.sanatorio;
      this.downloadPdf()
      this.dateForm.reset()
      this.openSnackBar("La descarga se realizó con éxito", "X")
    });
  }


  public downloadPdf() {

    let element = document.getElementById('table');

    html2pdf().from(element).set({
      margin: 0.4,
      filename: `resumen-${(this.mesData).replace(/\s/g, "-")}`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy']
      },
      jsPDF: { unit: 'in', format: 'A4', }
    }).toPdf().get('pdf').then(function (pdf) {
      let totalPages = pdf.internal.getNumberOfPages();

      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.text(`Hoja ${i} de ${totalPages}`, (pdf.internal.pageSize.getWidth() / 2.25), (pdf.internal.pageSize.getHeight() - 0.2));
      }
    }).save();
  }


  openDialogMama() {
    const dialogRef = this.dialog.open(ModalMesResumenComponent, {
      data: { data: this.mesData, sanatorio: this.sanatorioData  },
      disableClose: false,
      width: '25em',
      maxHeight: '100vh',
      panelClass: 'no-margin',
      closeOnNavigation: false
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.mesData = result.data;
      this.sanatorioData = result.sanatorio;
      this.selectedObraSocial = this.filterForm.controls['obraSocial'].value;
      this.downloadPdfMama()
      this.filterForm.reset()
      this.openSnackBar("La descarga se realizó con éxito", "X")
    });
  }


  downloadPdfMama() {
    let element = document.getElementById('tableMama');

    html2pdf().from(element).set({
      margin: 0.5,
      filename: `resumen-${(this.mesData).replace(/\s/g, "-")}-${(this.selectedObraSocial)}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy']
      },
      jsPDF: { unit: 'in', format: 'A4' }
    }).toPdf().get('pdf').then(function (pdf) {
      let totalPages = pdf.internal.getNumberOfPages();

      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.text(`Hoja ${i} de ${totalPages}`, (pdf.internal.pageSize.getWidth() / 2.25), (pdf.internal.pageSize.getHeight() - 0.2));
      }
    }).save();
  }

  editData(){
    console.log('funcionando')
  }

  deleteData(){
    console.log('eliminando')
  }
  
}

