
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LaboratorioDetalle } from './laboratorio-detalle';

import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of, throwError } from 'rxjs';

import { LaboratorioService } from '../../services/laboratorios';
import { Laboratorio } from '../../models/laboratorio';

class LaboratorioServiceMock {
  getById(id: number) {
    return of({} as Laboratorio);
  }
}

describe('Laboratorio-Detalle ', () => {
  let component: LaboratorioDetalle;
  let fixture: ComponentFixture<LaboratorioDetalle>;
  let serviceMock: LaboratorioServiceMock;


  let routeId: any = '1';

  beforeEach(async () => {
    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: (_key: string) => routeId
        }
      }
    };

    serviceMock = new LaboratorioServiceMock();

    await TestBed.configureTestingModule({
      imports: [LaboratorioDetalle, RouterTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: LaboratorioService, useValue: serviceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LaboratorioDetalle);
    component = fixture.componentInstance;
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar un laboratorio correctamente en ngOnInit', () => {
    routeId = '1';

    const mockLab: Laboratorio = {
      id: 1,
      nombre: 'Lab Test',
      direccion: 'Calle 123',
      telefono: '912345678'
    } as unknown as Laboratorio;

    spyOn(serviceMock, 'getById').and.returnValue(of(mockLab));

    component.ngOnInit();

    expect(serviceMock.getById).toHaveBeenCalledWith(1);
    expect(component.laboratorio).toEqual(mockLab);
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('');
  });

  it('debería manejar error si getById falla', () => {
    routeId = '1';

    spyOn(serviceMock, 'getById').and.returnValue(
      throwError(() => new Error('Backend error'))
    );

    component.ngOnInit();

    expect(component.loading).toBeFalse();
    expect(component.error).toBe('No se pudo cargar el laboratorio.');
    expect((component as any).laboratorio).toBeUndefined();
  });

  it('debería marcar error si el ID es inválido', () => {
    routeId = null;

    component.ngOnInit();

    expect(component.error).toBe('ID inválido.');
    expect(component.loading).toBeFalse();
  });
});

