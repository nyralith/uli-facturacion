import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.scss']
})
export class FacturasComponent {

  editOrder: any;
  orderData: any = []

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
    })


  }


  filterDate() {
    const fechaFactura: any = this.afiliadoForm.controls['fechaFactura']?.value?.toString()
    console.log(formatDate(fechaFactura, 'dd/MM/yyyy', 'en-US'))
  }

  addOrder() {
    console.log(this.analisisForm.controls['codigo'].value)
  }

  addNewAnalisis() {
    this.orderData.push('hola chiketitapepena')
  }


  deleteAnalisis() {

  }

}
