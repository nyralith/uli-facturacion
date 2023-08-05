import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIdentificadorAdminComponent } from './modal-identificador-admin.component';

describe('ModalIdentificadorAdminComponent', () => {
  let component: ModalIdentificadorAdminComponent;
  let fixture: ComponentFixture<ModalIdentificadorAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalIdentificadorAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalIdentificadorAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
