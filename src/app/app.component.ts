import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalIdentificadorAdminComponent } from './components/modal-identificador-admin/modal-identificador-admin.component';
import { Service } from './components/service/data.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'uli-facturas';
  ready = false;

  constructor(public dialog: MatDialog, private service: Service) {

  }

  ngOnInit() {
    this.openDialog()
  }


  openDialog() {
    const dialogRef = this.dialog.open(ModalIdentificadorAdminComponent, {
      disableClose: true,
      width: '25em',
      maxHeight: '100vh',
      panelClass: 'no-margin',
      closeOnNavigation: false
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.ready = true
    });
  }
}

