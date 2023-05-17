import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { map, startWith } from 'rxjs/operators';
import { data } from '../data/analisis';
import { Observable } from 'rxjs';





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
  data = data
  filteredCodes!: Observable<string[]>;
  filteredAnalisis!: Observable<string[]>;
  codigosData: any;
  analisisData: any;




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
    this.codigosData = []
    this.data.forEach(codigo => {
      this.codigosData.push(codigo.codigo)
    })
    this.analisisData = []
    this.data.forEach(data => {
      this.analisisData.push(data.analisis.toLowerCase())
    })

    this.filteredCodes = this.analisisForm.controls['codigo'].valueChanges.pipe(
      startWith(''),
      map(value => this._filterCodigo(value || '')),
    );


    this.filteredAnalisis = this.analisisForm.controls['analisis'].valueChanges.pipe(
      startWith(''),
      map(value => this._filterAnalisis(value || '')),
    )
  };


  private _filterCodigo(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.codigosData.filter((option: any) => option.includes(filterValue));
  }


  private _filterAnalisis(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.analisisData.filter((option: any) => option.includes(filterValue));
  }

  filterDate() {
    const fechaFactura: any = this.afiliadoForm.controls['fechaFactura']?.value?.toString()
    console.log(formatDate(fechaFactura, 'dd/MM/yyyy', 'en-US'))
  }

  addOrder() {
    if (this.afiliadoForm.controls['numAfiliado']?.value?.length !== 0 && this.afiliadoForm.controls['nombreAfiliado']?.value?.length !== 0
      && this.afiliadoForm.controls['fechaFactura']?.value?.length !== 0) {
      this.showCreateOrder = true
    }
    else {
      return
    }
  }


  autocompleteCodigo() {
    let code = this.analisisForm.controls['codigo'].value;
    let analisis = this.analisisForm.controls['analisis'].value;

    let codigoBuscado = data.find(data => data.codigo === code)
    let analisisBuscado = data.find(data => data.analisis.toLowerCase() === analisis)

    if (codigoBuscado) {
      this.analisisForm.controls['analisis'].patchValue(codigoBuscado.analisis.toLowerCase());
      this.analisisForm.controls['importe'].patchValue(codigoBuscado.importe);
      console.log('entrando en if')
    }
    else if (analisisBuscado) {
      console.log('entrando analisis buscado')
      this.analisisForm.controls['codigo'].patchValue(analisisBuscado.codigo);
      this.analisisForm.controls['importe'].patchValue(analisisBuscado.importe);
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
    console.log('holapes deleteadas')
  }

  sendOrder() {
    console.log('enviando orden')
    this.dataSource.data = []
    this.dataSource._updateChangeSubscription()
  }

}
