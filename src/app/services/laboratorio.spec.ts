

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule,HttpTestingController} from '@angular/common/http/testing';

import { LaboratorioService } from './laboratorios';
import { environment } from '../../environments/environment';
import { Laboratorio } from '../models/laboratorio';

describe('LaboratorioService ', () => {
  let service: LaboratorioService;
  let httpMock: HttpTestingController;

  
  const apiUrl = `${environment.apiBaseUrlabs}/laboratorios`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(LaboratorioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

 
  it('debería obtener la lista de laboratorios (GET /laboratorios)', () => {
    const mockLabs: Laboratorio[] = [
      { id: 1, nombre: 'Lab 1', direccion: 'Dir 1', telefono: 111111111 } as unknown as Laboratorio,
      { id: 2, nombre: 'Lab 2', direccion: 'Dir 2', telefono: 222222222 } as unknown as Laboratorio
    ];

    service.getAll().subscribe((labs) => {
      expect(labs.length).toBe(2);
      expect(labs).toEqual(mockLabs);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');

    req.flush(mockLabs);
  });


  it('debería obtener un laboratorio por ID (GET /laboratorios/:id)', () => {
    const idBuscado = 10;

    const mockLab: Laboratorio = {
      id: idBuscado,
      nombre: 'Lab Detalle',
      direccion: 'Calle 123',
      telefono: 987654321
    } as unknown as Laboratorio;

    service.getById(idBuscado).subscribe((lab) => {
      expect(lab).toBeTruthy();
      expect(lab.id).toBe(idBuscado);
      expect(lab).toEqual(mockLab);
    });

    const req = httpMock.expectOne(`${apiUrl}/${idBuscado}`);
    expect(req.request.method).toBe('GET');

    req.flush(mockLab);
  });

 
  it('debería crear un laboratorio nuevo (POST /laboratorios)', () => {
    const nuevoLab: Omit<Laboratorio, 'id'> = {
      nombre: 'Nuevo Lab',
      direccion: 'Av. Principal 100',
      telefono: 912345678
    } as any;

    const mockRespuesta: Laboratorio = {
      id: 99,
      ...(nuevoLab as any)
    } as Laboratorio;

    service.create(nuevoLab).subscribe((labCreado) => {
      expect(labCreado).toBeTruthy();
      expect(labCreado.id).toBe(99);
      expect(labCreado.nombre).toBe('Nuevo Lab');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nuevoLab);

    req.flush(mockRespuesta);
  });

 
  it('debería actualizar un laboratorio existente (PUT /laboratorios/:id)', () => {
    const idLab = 5;

    const cambios: Partial<Laboratorio> = {
      nombre: 'Nombre Actualizado',
      telefono: 900000000
    };

    const mockRespuesta: Laboratorio = {
      id: idLab,
      nombre: 'Nombre Actualizado',
      direccion: 'Dir Original',
      telefono: 900000000
    } as unknown as Laboratorio;

    service.update(idLab, cambios).subscribe((labActualizado) => {
      expect(labActualizado).toBeTruthy();
      expect(labActualizado.id).toBe(idLab);
      expect(labActualizado.nombre).toBe('Nombre Actualizado');
      expect(labActualizado.telefono).toBe(900000000);
    });

    const req = httpMock.expectOne(`${apiUrl}/${idLab}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(cambios);

    req.flush(mockRespuesta);
  });

  
  it('debería eliminar un laboratorio (DELETE /laboratorios/:id)', () => {
    const idLab = 7;

    service.delete(idLab).subscribe((resp) => {
      expect(resp).toBeUndefined();
    });

    const req = httpMock.expectOne(`${apiUrl}/${idLab}`);
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });
});
