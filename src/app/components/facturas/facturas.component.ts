import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

import { data } from '../data/analisis';





@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.scss']
})
export class FacturasComponent {
  editOrder: any;
  showCreateOrder: boolean = false;
  displayedColumns: string[] = ['codigo', 'analisis', 'importe'];
  dataSource = new MatTableDataSource<any>



  codigos: any = [
    '475',
    '746',
    '412',
    '902',
    '192',
    '546',
    '1001',
    '5',
    '592',
    '171',
  ]
  analisis: any = [
    'HEMOGRAMA',
    'PLAQUETAS, RECUENTO DE',
    'GLUCEMIA o GLUCOSURIA (C/U)',
    'UREA, sérica',
    'CREATININA - sérica o urinaria',
    'IONOGRAMA - sérico',
    'ACTO BIOQUÍMICO DE INTERNACION -',
    'ACIDO BASE , Estado Acido Base (EAB)',
    'COAGULOGRAMA',
    'LACTICO, ACIDO ENZIMATICO.'
  ]

  afiliadoForm = new FormGroup({
    numAfiliado: new FormControl('', Validators.required),
    nombreAfiliado: new FormControl('', Validators.required),
    fechaFactura: new FormControl('', Validators.required)
  })

  analisisForm: FormGroup;

  constructor(private fb: FormBuilder,) {
    this.analisisForm = this.fb.group({
      codigo: ['', Validators.required],
      analisis: ['', Validators.required],
      importe: ['', Validators.required],
      nbu: ['', Validators.required]
    })
  }

  ngOnInit() {
    console.log(data[0])
  }

  filterDate() {
    const fechaFactura: any = this.afiliadoForm.controls['fechaFactura']?.value?.toString()
    console.log(formatDate(fechaFactura, 'dd/MM/yyyy', 'en-US'))
  }

  addOrder() {
    if (this.afiliadoForm.controls['numAfiliado']?.value?.length !== 0 && this.afiliadoForm.controls['nombreAfiliado']?.value?.length !== 0
      && this.afiliadoForm.controls['fechaFactura']?.value?.length !== 0) {
      this.showCreateOrder = true
      console.log(this.showCreateOrder)
    }
    else {
      return
    }
  }

  addNewAnalisis() {
    let codigo = this.analisisForm.controls['codigo'].value;
    let analisis = this.analisisForm.controls['analisis'].value;
    let importe = this.analisisForm.controls['importe'].value;
    let nbu = this.analisisForm.controls['nbu'].value;

    let orden = {
      codigo: codigo,
      analisis: analisis,
      importe: importe * nbu,
    }
    this.dataSource.data.push(orden)
    this.dataSource._updateChangeSubscription()
  }

  deleteAnalisis() {
    console.log('holapes')
  }

  sendOrder() {
    console.log('enviando orden')
    this.dataSource.data = []
    this.dataSource._updateChangeSubscription()
  }

}
