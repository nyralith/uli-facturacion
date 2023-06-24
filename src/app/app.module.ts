import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FacturasComponent } from './components/facturas/facturas.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ResumenComponent } from './components/resumen/resumen.component';
import { MatTabsModule } from '@angular/material/tabs';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { Service } from './components/service/data.service';
import { ResumenFacturacionPacienteComponent } from './components/resumen-facturacion-paciente/resumen-facturacion-paciente.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalMesResumenComponent } from './components/modal-mes-resumen/modal-mes-resumen.component';


@NgModule({
  declarations: [
    AppComponent,
    FacturasComponent,
    ResumenComponent,
    ResumenFacturacionPacienteComponent,
    ModalMesResumenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatDialogModule,
    AngularFireModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
  providers: [MatDatepickerModule, Service, AngularFireModule],
  bootstrap: [AppComponent]
})
export class AppModule {




}
