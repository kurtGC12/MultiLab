import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import {ResultadosService} from './resultados';
import { Resultado } from '../../models/resultado';
import { environment } from '../../../environments/environment';

describe('ResultadosService', () => {
  let service: ResultadosService;
  let httpMock: HttpTestingController;

  const baseUrl = `${environment.apiBaseUrlRult}/api/resultados`;

  const mockResultado: Resultado = {
    id: 1,
    laboratorioId: 1,
    analistaId: 10,
    fechaMuestra: '2025-12-20',
    fechaResultado: '2025-12-21',
    observacion: 'OK',
    estado: 'REGISTRADO'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(ResultadosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getAll() sin filtros debe hacer GET a /api/resultados', () => {
    service.getAll().subscribe((res) => {
      expect(res.length).toBe(1);
      expect(res[0].id).toBe(1);
    });

    const req = httpMock.expectOne((r) => r.method === 'GET' && r.url === baseUrl);
    expect(req.request.params.keys().length).toBe(0);
    req.flush([mockResultado]);
  });

  it('getAll() con filtros debe enviar query params', () => {
    service.getAll({ laboratorioId: 1, analistaId: 10 }).subscribe((res) => {
      expect(res.length).toBe(1);
      expect(res[0].laboratorioId).toBe(1);
      expect(res[0].analistaId).toBe(10);
    });

    const req = httpMock.expectOne((r) => r.method === 'GET' && r.url === baseUrl);
    expect(req.request.params.get('laboratorioId')).toBe('1');
    expect(req.request.params.get('analistaId')).toBe('10');
    req.flush([mockResultado]);
  });

  it('getById() debe hacer GET a /api/resultados/{id}', () => {
    service.getById(1).subscribe((res) => {
      expect(res.id).toBe(1);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResultado);
  });

  it('create() debe hacer POST a /api/resultados', () => {
    const payload: Resultado = {
      laboratorioId: 2,
      analistaId: 11,
      fechaMuestra: '2025-12-18',
      fechaResultado: '2025-12-19',
      observacion: 'Creación',
      estado: 'REGISTRADO'
    };

    service.create(payload).subscribe((res) => {
      expect(res.id).toBe(99);
      expect(res.laboratorioId).toBe(2);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.laboratorioId).toBe(2);
    req.flush({ ...payload, id: 99 });
  });

  it('createBatch() debe hacer POST a /api/resultados/batch', () => {
    const batch: Resultado[] = [
      { laboratorioId: 1, analistaId: 10, estado: 'REGISTRADO', observacion: 'A' },
      { laboratorioId: 1, analistaId: 11, estado: 'VALIDADO', observacion: 'B' }
    ];

    service.createBatch(batch).subscribe((res) => {
      expect(res.length).toBe(2);
      expect(res[0].id).toBe(1);
      expect(res[1].id).toBe(2);
    });

    const req = httpMock.expectOne(`${baseUrl}/batch`);
    expect(req.request.method).toBe('POST');
    expect(Array.isArray(req.request.body)).toBeTrue();
    expect(req.request.body.length).toBe(2);
    req.flush([{ ...batch[0], id: 1 }, { ...batch[1], id: 2 }]);
  });

  it('update() debe hacer PUT a /api/resultados/{id}', () => {
    const payload: Resultado = {
      laboratorioId: 9,
      analistaId: 10,
      estado: 'VALIDADO',
      observacion: 'Actualizado'
    };

    service.update(1, payload).subscribe((res) => {
      expect(res.observacion).toBe('Actualizado');
      expect(res.estado).toBe('VALIDADO');
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.estado).toBe('VALIDADO');
    req.flush({ ...payload, id: 1 });
  });

  it('delete() debe hacer DELETE a /api/resultados/{id}', () => {
    service.delete(1).subscribe((res) => {
      expect(res).toBeUndefined(); // void
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});