import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratorioForm } from './laboratorio-form';

describe('LaboratorioForm', () => {
  let component: LaboratorioForm;
  let fixture: ComponentFixture<LaboratorioForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaboratorioForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaboratorioForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
