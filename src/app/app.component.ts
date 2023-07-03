import { Component, ElementRef, ViewChild } from '@angular/core';
import * as html2pdf from 'html2pdf.js'
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'uli-facturas';


  @ViewChild('pdfTable') pdfTable: ElementRef;
  
  public downloadAsPDF() {
    const doc = new jsPDF();
   
    const pdfTable = this.pdfTable.nativeElement;
   
    let html = htmlToPdfmake(pdfTable.innerHTML);
     
    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).open(); 
     
  }
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

