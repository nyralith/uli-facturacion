import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface ModalData {
  data: string;
  sanatorio: string;
}

@Component({
  selector: 'app-modal-mes-resumen',
  templateUrl: './modal-mes-resumen.component.html',
  styleUrls: ['./modal-mes-resumen.component.scss']
})
export class ModalMesResumenComponent {

  data: ModalData;

  constructor(
    public dialogRef: MatDialogRef<ModalMesResumenComponent>,
    @Inject(MAT_DIALOG_DATA) public initialData: ModalData
  ) {
    // Generar mes y año actual por defecto
    const currentDate = new Date();
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const defaultMonthYear = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    
    // Inicializar con los datos recibidos o valores por defecto
    this.data = {
      data: initialData?.data || defaultMonthYear,
      sanatorio: initialData?.sanatorio || 'Sanatorio Sur'
    };
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
