import { formatDate } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { map, startWith } from 'rxjs/operators';
import { data } from '../data/analisis';
import { Observable } from 'rxjs';
import { Service } from '../service/data.service';
import { v4 as uuidv4 } from 'uuid';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.scss']
})
export class FacturasComponent {
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key == '+') {
      if (this.dataSource.data.length !== 0) {
        this.saveOrder()
      } else return
    }
  }

  isUli: any
  isMama: any
  editOrder: any;
  showCreateOrder: boolean = false;
  displayedColumns: string[] = ['codigo', 'analisis', 'importe', 'eliminar'];
  dataSource = new MatTableDataSource<any>
  data = data
  filteredCodes!: Observable<string[]>;
  filteredAnalisis!: Observable<string[]>;
  ordenes: any = [];
  codigosData: any;
  analisisData: any;
  ordersToSend: any = [];
  importeTotal: number = 0;

  afiliadoForm = new FormGroup({
    numAfiliado: new FormControl('', Validators.required),
    nombreAfiliado: new FormControl('', Validators.required),
    fechaFactura: new FormControl('', Validators.required),
    nbu: new FormControl('', Validators.required),
    numOrden: new FormControl(),
    obraSocial: new FormControl('', Validators.required),
  })
  analisisForm: FormGroup;

  constructor(private fb: FormBuilder, private service: Service, private _snackBar: MatSnackBar) {
    this.isUli = this.service.isUli
    this.isMama = this.service.isMama
    this.analisisForm = this.fb.group({
      codigo: ['', Validators.required],
      analisis: ['', Validators.required],
      importe: ['', Validators.required],
    })
  }

  openSnackBar(message, action) {
    let snackBarRef = this._snackBar.open(message, action, { duration: 5000 });
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

  filterDate(date: any) {
    const fechaFactura: any = date.toString()
    return formatDate(fechaFactura, 'MM/yyyy', 'en-US')
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
    }
    else if (analisisBuscado) {
      this.analisisForm.controls['codigo'].patchValue(analisisBuscado.codigo);
      this.analisisForm.controls['importe'].patchValue(analisisBuscado.importe);
    }
    else {
      return
    }
  }
  addNewAnalisis() {
    console.log(this.afiliadoForm.controls)
    let codigo = (this.analisisForm.controls['codigo'].value);
    let analisis = this.analisisForm.controls['analisis'].value;
    let importe = parseFloat(this.analisisForm.controls['importe'].value);
    let nbu = parseFloat(this.afiliadoForm.controls['nbu'].value!);

    if (!isNaN(importe)) {
      let orden = {
        codigo: codigo,
        analisis: analisis,
        importe: Math.round(importe * nbu),
      }
      this.analisisForm.controls['codigo'].patchValue('')
      this.analisisForm.controls['analisis'].patchValue('');
      this.analisisForm.controls['importe'].patchValue('');
      this.dataSource.data.push(orden);
      this.dataSource._updateChangeSubscription();

    } else if (isNaN(importe)) {
      let orden = {
        codigo: codigo,
        analisis: analisis,
        importe: '-',
      }
      this.analisisForm.controls['codigo'].patchValue('')
      this.analisisForm.controls['analisis'].patchValue('');
      this.analisisForm.controls['importe'].patchValue('');
      this.dataSource.data.push(orden);
      this.dataSource._updateChangeSubscription();
    }
  }

  deleteAnalisis(index: number) {
    this.openSnackBar("Se borró con éxito", "X")
    this.dataSource.data.splice(index, 1)
    this.dataSource._updateChangeSubscription();
  }


  saveOrder() {
    for (const element of this.dataSource.data) {
      if (!isNaN(element.importe)) {
        this.importeTotal += element.importe
      }

    }
    this.ordersToSend.push(
      {
        orden: this.dataSource.data
      }
    )
    this.openSnackBar("La guardó la orden", "X");
    this.dataSource.data = [];
  }

  async sendOrders() {
    let randomid = uuidv4();
    const dataToSend = {
      numAfiliado: this.afiliadoForm.controls['numAfiliado'].value,
      nameAfiliado: this.afiliadoForm.controls['nombreAfiliado'].value,
      fecha: this.filterDate(this.afiliadoForm.controls['fechaFactura'].value),
      ordenes: this.ordersToSend,
      importe: this.importeTotal,
      numOrden: (this.afiliadoForm.controls['numOrden'].value) ? this.afiliadoForm.controls['numOrden'].value : '-',
      obraSocial: this.afiliadoForm.controls['obraSocial'].value,
    };
    console.log(dataToSend, ' data enviada')

    if (this.afiliadoForm.controls['numOrden'].value.length) {
      await this.service.addOrders(randomid, dataToSend, 'facturasMami')
    } else {
      await this.service.addOrders(randomid, dataToSend, 'facturas')
    }



    this.ordersToSend = [];
    this.dataSource.data = [];
    this.importeTotal = 0;


    this.afiliadoForm.controls['numAfiliado'].patchValue('');
    this.afiliadoForm.controls['nombreAfiliado'].patchValue('');
    this.afiliadoForm.controls['numOrden'].patchValue('');
    this.dataSource._updateChangeSubscription();
    this.analisisForm.reset();
    this.openSnackBar("Se enviaron las órdenes", "X")
  }


}