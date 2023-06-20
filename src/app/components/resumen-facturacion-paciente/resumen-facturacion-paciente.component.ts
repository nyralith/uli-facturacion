import { Component } from '@angular/core';
import * as html2pdf from 'html2pdf.js'



@Component({
  selector: 'app-resumen-facturacion-paciente',
  templateUrl: './resumen-facturacion-paciente.component.html',
  styleUrls: ['./resumen-facturacion-paciente.component.scss']
})
export class ResumenFacturacionPacienteComponent {

  
  downloadPdf() {
    let element = document.getElementById('table');
    let opt = {
      margin: 1,
      filename: 'resumen.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // New Promise-based usage:
    html2pdf().from(element).set(opt).save();
  }


}
