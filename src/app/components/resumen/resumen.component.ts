import { Component } from '@angular/core';


const ELEMENT_DATA: any = [
  {
  numAfi: 1,
  nombAfi: "ROBERT",
  codigo: 123456,
  analisisRealizados: "ANAL",
  importe: 900,
}
]


@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.scss']
})
export class ResumenComponent {
  displayedColumns: string[] = ['numAfi', 'nombAfi', 'codigo', 'analisisRealizados', 'importe'];
  // dataSource = new MatTableDataSource<any>;
  dataSource = ELEMENT_DATA;


}

