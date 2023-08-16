import { Component, OnInit } from "@angular/core";
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Service } from "../service/data.service";


@Component({
  selector: 'app-modal-identificador-admin',
  templateUrl: './modal-identificador-admin.component.html',
  styleUrls: ['./modal-identificador-admin.component.scss']

})
export class ModalIdentificadorAdminComponent implements OnInit {



  constructor(public dialogRef: MatDialogRef<ModalIdentificadorAdminComponent>, private service: Service) { }

  ngOnInit() {

  }

  chooseUser(usuario: string) {
    if (usuario === 'uli') {
      this.service.isUli = true;
      this.service.isMama = false;
    } else {
      this.service.isUli = false;
      this.service.isMama = true;
    }
    this.dialogRef.close();
  }
}

