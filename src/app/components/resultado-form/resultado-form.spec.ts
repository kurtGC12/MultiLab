import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoForm } from './resultado-form';

describe('ResultadoForm', () => {
  let component: ResultadoForm;
  let fixture: ComponentFixture<ResultadoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultadoForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultadoForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
