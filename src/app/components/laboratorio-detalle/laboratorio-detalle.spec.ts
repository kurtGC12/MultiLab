import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratorioDetalle } from './laboratorio-detalle';

describe('LaboratorioDetalle', () => {
  let component: LaboratorioDetalle;
  let fixture: ComponentFixture<LaboratorioDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaboratorioDetalle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaboratorioDetalle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
