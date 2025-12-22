import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ResultadosService } from './resultados';
import { Resultado } from '../models/resultado';
import { environment } from '../../environments/environment';

describe('ResultadosService', () => {
  let service: ResultadosService;
  let httpMock: HttpTestingController;
  
  const baseUrl = `${environment.apiBaseUrlRult}/resultados`;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ResultadosService]
    });
    service = TestBed.inject(ResultadosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debe obtener todos los resultados sin filtros', () => {
    const mockData: Resultado[] = [{ id: 1 } as Resultado, { id: 2 } as Resultado];
    service.getAll().subscribe(data => {
      expect(data.length).toBe(2);
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debe obtener resultados con filtro de laboratorioId', () => {
    const mockData: Resultado[] = [{ id: 1, laboratorioId: 5 } as Resultado];
    service.getAll({ laboratorioId: 5 }).subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne(`${baseUrl}?laboratorioId=5`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debe obtener resultados con filtro de analistaId', () => {
    const mockData: Resultado[] = [{ id: 1, analistaId: 3 } as Resultado];
    service.getAll({ analistaId: 3 }).subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne(`${baseUrl}?analistaId=3`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debe obtener un resultado por id', () => {
    const mockData: Resultado = { id: 1 } as Resultado;
    service.getById(1).subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debe crear un nuevo resultado', () => {
    const newResultado: Resultado = { id: 1 } as Resultado;
    service.create(newResultado).subscribe(data => {
      expect(data).toEqual(newResultado);
    });
    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newResultado);
    req.flush(newResultado);
  });


  it('debe actualizar un resultado existente', () => {
    const updateResultado: Resultado = { id: 1 } as Resultado;
    service.update(1, updateResultado).subscribe(data => {
      expect(data).toEqual(updateResultado);
    });
    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateResultado);
    req.flush(updateResultado);
  });

  it('debe eliminar un resultado por id', () => {
    service.delete(1).subscribe(data => {
      expect(data).toBeNull();
    });
    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
