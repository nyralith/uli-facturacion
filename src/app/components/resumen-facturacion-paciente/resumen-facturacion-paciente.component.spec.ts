import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenFacturacionPacienteComponent } from './resumen-facturacion-paciente.component';

describe('ResumenFacturacionPacienteComponent', () => {
  let component: ResumenFacturacionPacienteComponent;
  let fixture: ComponentFixture<ResumenFacturacionPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumenFacturacionPacienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumenFacturacionPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
