import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMesResumenComponent } from './modal-mes-resumen.component';

describe('ModalMesResumenComponent', () => {
  let component: ModalMesResumenComponent;
  let fixture: ComponentFixture<ModalMesResumenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalMesResumenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalMesResumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
