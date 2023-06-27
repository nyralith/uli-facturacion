import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as html2pdf from 'html2pdf.js'
import { Service } from '../service/data.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ModalMesResumenComponent } from '../modal-mes-resumen/modal-mes-resumen.component';


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
  dataArray: any = []

  filterForm = new FormGroup({
    nameAfiliado: new FormControl('', Validators.required),
    fechaFactura: new FormControl('', Validators.required),
  })

  constructor(private service: Service, public dialog: MatDialog) {

  }


  async ngOnInit() {
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
    });
  }

  async getFilteredData() {
    this.filteredData = []
    this.dataArray = []
    this.filteredData = await this.service.getFilteredFactura((this.filterDate(this.filterForm.controls['fechaFactura'].value).toString()), this.filterForm.controls['nameAfiliado'].value);

    this.filteredData.forEach(element => {
      const data = {
        numAfiliado: element.afiliado.numAfiliado,
        nameAfiliado: element.afiliado.nameAfiliado,
        fecha: element.afiliado.fecha,
        importe: element.afiliado.importe,
        ordenes: element.afiliado.ordenes
      };
      this.dataArray.push(data)
    });

  }


  downloadPdf() {
    let element = document.getElementById('table');
    let opt = {
      margin: 1,
      filename: `resumen-${(this.mesData).replace(/\s/g, "-")}`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // New Promise-based usage:
    html2pdf().from(element).set(opt).save();
  }


}
