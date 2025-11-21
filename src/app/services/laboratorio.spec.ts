import { TestBed } from '@angular/core/testing';

import { LaboratorioService } from './laboratorios';

describe('Laboratorio', () => {
  let service: LaboratorioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaboratorioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
