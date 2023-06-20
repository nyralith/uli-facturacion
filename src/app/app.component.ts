import { Component } from '@angular/core';
import * as html2pdf from 'html2pdf.js'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'uli-facturas';
//   downloadPdf(){
//     var element = document.getElementById('table');
// var opt = {
//   margin:       1,
//   filename:     'output.pdf',
//   image:        { type: 'jpeg', quality: 0.98 },
//   html2canvas:  { scale: 2 },
//   jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
// };
 
// // New Promise-based usage:
// html2pdf().from(element).set(opt).save();
//   }

}

