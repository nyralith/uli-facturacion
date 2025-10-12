import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as html2pdf from 'html2pdf.js';
import { Service } from '../service/data.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalMesResumenComponent } from '../modal-mes-resumen/modal-mes-resumen.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Interfaces para tipado fuerte
interface Orden {
  codigo: string;
  analisis: string;
  importe: number;
}

interface OrdenGroup {
  orden: Orden[];
}

interface AfiliadoData {
  numAfiliado: string;
  nameAfiliado: string;
  fecha: string;
  importe: number;
  ordenes: OrdenGroup[];
}

interface FilteredDataItem {
  afiliado: AfiliadoData;
}

interface ModalResult {
  data: string;
  sanatorio: string;
}

interface PdfOptions {
  margin: number[];
  filename: string;
  image: {
    type: string;
    quality: number;
  };
  html2canvas: {
    scale: number;
    useCORS: boolean;
    letterRendering: boolean;
    allowTaint: boolean;
    removeContainer: boolean;
    logging: boolean;
    scrollX: number;
    scrollY: number;
    windowWidth: number;
    windowHeight: number;
  };
  pagebreak: {
    mode: string[];
    avoid: string[];
    before: string[];
    after: string[];
  };
  jsPDF: {
    unit: string;
    format: string;
    orientation: string;
    compress: boolean;
    hotfixes: string[];
  };
}

@Component({
  selector: 'app-resumen-facturacion-paciente',
  templateUrl: './resumen-facturacion-paciente.component.html',
  styleUrls: ['./resumen-facturacion-paciente.component.scss'],
})
export class ResumenFacturacionPacienteComponent implements OnInit, OnDestroy {
  // Propiedades con tipos específicos
  filteredData: FilteredDataItem[] = [];
  dataSource = new MatTableDataSource<AfiliadoData>();
  dataArray: AfiliadoData[] = [];
  totalCost: number = 0;
  isLoading: boolean = false;

  // Datos del modal y PDF
  mesData?: string;
  sanatorioData?: string;
  diaData?: Date;

  // Form controls con validación mejorada
  readonly filterForm = new FormGroup({
    nameAfiliado: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    fechaFactura: new FormControl('', Validators.required),
  });

  // Subject para manejar subscripciones
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly service: Service,
    public readonly dialog: MatDialog,
    private readonly _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Inicialización si es necesaria
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openSnackBar(message: string, action: string): void {
    this._snackBar.open(message, action, { duration: 5000 });
  }

  private filterDate(date: Date | string): string {
    return formatDate(date, 'MM/yyyy', 'en-US');
  }

  private showError(message: string): void {
    this.openSnackBar(`Error: ${message}`, 'Cerrar');
  }

  private showSuccess(message: string): void {
    this.openSnackBar(message, 'X');
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalMesResumenComponent, {
      data: {
        data: this.mesData || '',
        sanatorio: this.sanatorioData || '',
      },
      disableClose: false,
      width: '550px',
      height: '350px',
      maxWidth: '90vw',
      panelClass: 'custom-modal-panel',
      closeOnNavigation: false,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: ModalResult) => {
        if (result) {
          this.mesData = result.data;
          this.sanatorioData = result.sanatorio;
          this.downloadPdf();
          this.showSuccess('La descarga se realizó con éxito');
        }
      });
  }

  async getFilteredData(): Promise<void> {
    if (this.filterForm.invalid) {
      this.showError('Por favor complete todos los campos requeridos');
      return;
    }

    const fechaValue = this.filterForm.controls['fechaFactura'].value;
    const nombreValue = this.filterForm.controls['nameAfiliado'].value;

    if (!fechaValue || !nombreValue) {
      this.showError('Fecha y nombre de afiliado son requeridos');
      return;
    }

    try {
      this.isLoading = true;
      this.diaData = new Date(fechaValue);
      this.filteredData = [];
      this.dataArray = [];
      this.totalCost = 0;

      this.filteredData = await this.service.getFilteredFactura(
        this.filterDate(fechaValue),
        nombreValue
      );

      this.processFilteredData();
      this.showSuccess('Los datos se cargaron correctamente');
    } catch (error) {
      console.error('Error al obtener datos filtrados:', error);
      this.showError('Error al cargar los datos');
    } finally {
      this.isLoading = false;
    }
  }

  private processFilteredData(): void {
    this.filteredData.forEach((element) => {
      const data: AfiliadoData = {
        numAfiliado: element.afiliado.numAfiliado,
        nameAfiliado: element.afiliado.nameAfiliado,
        fecha: element.afiliado.fecha,
        importe: element.afiliado.importe,
        ordenes: element.afiliado.ordenes,
      };

      if (!isNaN(element.afiliado.importe)) {
        this.totalCost += element.afiliado.importe;
      }

      this.dataArray.push(data);
    });
  }

  async downloadPdf(): Promise<void> {
    if (!this.mesData || !this.sanatorioData) {
      this.showError('Faltan datos del modal para generar el PDF');
      return;
    }

    const element = document.getElementById('table');
    if (!element) {
      this.showError('No se encontró el elemento de la tabla');
      return;
    }

    try {
      this.isLoading = true;
      const options = this.getPdfOptions();

      this.applyPdfStyles();

      const pdf = await html2pdf()
        .from(element)
        .set(options)
        .toPdf()
        .get('pdf');
      this.addPageNumbers(pdf);

      await pdf.save();
      this.showSuccess('PDF generado correctamente');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      this.showError('Error al generar el PDF');
    } finally {
      this.removePdfStyles();
      this.isLoading = false;
    }
  }

  private getPdfOptions(): PdfOptions {
    const nombreAfiliado =
      this.filterForm.controls['nameAfiliado'].value || 'paciente';
    const mes = this.mesData || 'mes';

    return {
      margin: [0.5, 0.3, 0.5, 0.3],
      filename: `resumen-${mes.replace(/\s/g, '-')}-${nombreAfiliado}`,
      image: {
        type: 'jpeg',
        quality: 1.0,
      },
      html2canvas: {
        scale: 1.2,
        useCORS: true,
        letterRendering: true,
        allowTaint: false,
        removeContainer: true,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794,
        windowHeight: 1123,
      },
      pagebreak: {
        mode: ['css', 'legacy'],
        avoid: [
          '.patient-header',
          '.patient-group',
          '.order-row',
          '.total-row',
        ],
        before: ['.page-break-before'],
        after: ['.page-break-after'],
      },
      jsPDF: {
        unit: 'in',
        format: 'A4',
        orientation: 'portrait',
        compress: true,
        hotfixes: ['px_scaling'],
      },
    };
  }

  private addPageNumbers(pdf: any): void {
    const totalPages = pdf.internal.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text(
        `Hoja ${i} de ${totalPages}`,
        pdf.internal.pageSize.getWidth() / 2.25,
        pdf.internal.pageSize.getHeight() - 0.2
      );
    }
  }

  private applyPdfStyles(): void {
    const style = document.createElement('style');
    style.id = 'pdf-temp-styles';
    style.textContent = `
      #table * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      #table .patient-header {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }
      #table .order-row:last-child {
        page-break-after: auto !important;
      }
      #table .total-row {
        page-break-before: avoid !important;
        break-before: avoid !important;
      }
    `;
    document.head.appendChild(style);
  }

  private removePdfStyles(): void {
    const tempStyle = document.getElementById('pdf-temp-styles');
    if (tempStyle) {
      tempStyle.remove();
    }
  }
}
