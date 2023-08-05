import { Component, OnInit } from "@angular/core";
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-modal-identificador-admin',
  templateUrl: './modal-identificador-admin.component.html',
  styleUrls: ['./modal-identificador-admin.component.scss']
  
})
export class ModalIdentificadorAdminComponent implements OnInit {

  constructor() {}

  ngOnInit() {
    console.log("En este instante el componente ha cargado");
  }

}

