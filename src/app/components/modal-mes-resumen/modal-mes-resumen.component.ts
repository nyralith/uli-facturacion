import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-mes-resumen',
  templateUrl: './modal-mes-resumen.component.html',
  styleUrls: ['./modal-mes-resumen.component.scss']
})
export class ModalMesResumenComponent {

data: any = {
  data: '',
  sanatorio: '',
}

  constructor(public dialogRef: MatDialogRef<ModalMesResumenComponent>) {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
