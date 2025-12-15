import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of, throwError } from 'rxjs';

import { LaboratorioList } from './laboratorio-list';
import { LaboratorioService } from '../../services/laboratorios';
import { AuthService } from '../../services/auth';
import { Laboratorio } from '../../models/laboratorio';


class LaboratorioServiceMock {
  getAll() {
    return of([] as Laboratorio[]);
  }
  delete(_id: number) {
    return of(undefined);
  }
}

class AuthServiceMock {
  // el template usa auth.esAdmin()
  esAdmin() {
    return true;
  }
}

describe('LaboratorioList ', () => {
  let component: LaboratorioList;
  let fixture: ComponentFixture<LaboratorioList>;
  let serviceMock: LaboratorioServiceMock;
  let authMock: AuthServiceMock;

  beforeEach(async () => {
    serviceMock = new LaboratorioServiceMock();
    authMock = new AuthServiceMock();

    await TestBed.configureTestingModule({
      imports: [
        LaboratorioList,            // standalone
        RouterTestingModule,        // routerLink en HTML
        HttpClientTestingModule     // opcional, pero no estorba
      ],
      providers: [
        { provide: LaboratorioService, useValue: serviceMock },
        { provide: AuthService, useValue: authMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LaboratorioList);
    component = fixture.componentInstance;
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit debería llamar a getAll y cargar laboratorios', () => {
    const mockLabs: Laboratorio[] = [
      { id: 1, nombre: 'Lab A', direccion: 'Dir A', telefono: '111111111' } as unknown as Laboratorio,
      { id: 2, nombre: 'Lab B', direccion: 'Dir B', telefono: '222222222' } as unknown as Laboratorio,
    ];

    const spyGetAll = spyOn(serviceMock, 'getAll').and.returnValue(of(mockLabs));

    fixture.detectChanges(); // dispara ngOnInit()

    expect(spyGetAll).toHaveBeenCalled();
    expect(component.laboratorios).toEqual(mockLabs);
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('');
  });

  it('debería manejar error si getAll falla', () => {
    spyOn(serviceMock, 'getAll').and.returnValue(
      throwError(() => new Error('Backend error'))
    );

    fixture.detectChanges(); // ngOnInit

    expect(component.loading).toBeFalse();
    expect(component.laboratorios.length).toBe(0);
    expect(component.error).toBe('Error al cargar los laboratorios.');
  });

  it('debería renderizar el HTML con filas de la tabla (tbody tr)', () => {
    const mockLabs: Laboratorio[] = [
      { id: 1, nombre: 'Lab Render 1', direccion: 'Dir 1', telefono: '111' } as unknown as Laboratorio,
      { id: 2, nombre: 'Lab Render 2', direccion: 'Dir 2', telefono: '222' } as unknown as Laboratorio,
    ];

    spyOn(serviceMock, 'getAll').and.returnValue(of(mockLabs));

    fixture.detectChanges(); // ngOnInit + render
    const compiled = fixture.nativeElement as HTMLElement;

    const rows = compiled.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
    expect(compiled.textContent).toContain('Lab Render 1');
    expect(compiled.textContent).toContain('Lab Render 2');
  });

  it('debería mostrar el botón "Nuevo Laboratorio" si esAdmin() = true', () => {
    spyOn(authMock, 'esAdmin').and.returnValue(true);
    spyOn(serviceMock, 'getAll').and.returnValue(of([] as Laboratorio[]));

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Nuevo Laboratorio');
  });

  it('NO debería mostrar acciones admin si esAdmin() = false', () => {
    spyOn(authMock, 'esAdmin').and.returnValue(false);

    spyOn(serviceMock, 'getAll').and.returnValue(
      of([{ id: 1, nombre: 'X', direccion: 'Y', telefono: 'Z' } as unknown as Laboratorio])
    );

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).not.toContain('Nuevo Laboratorio');
    expect(compiled.textContent).not.toContain('Editar');
    expect(compiled.textContent).not.toContain('Eliminar');
  });

  it('eliminar(): si confirm es false, no debe llamar delete()', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    const spyDelete = spyOn(serviceMock, 'delete').and.callThrough();

    component.eliminar(1);

    expect(spyDelete).not.toHaveBeenCalled();
  });

  it('eliminar(): si confirm es true, debe llamar delete() y remover de la lista', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    component.laboratorios = [
      { id: 1, nombre: 'A', direccion: 'D', telefono: '1' } as unknown as Laboratorio,
      { id: 2, nombre: 'B', direccion: 'D', telefono: '2' } as unknown as Laboratorio
    ];

    const spyDelete = spyOn(serviceMock, 'delete').and.returnValue(of(undefined));

    component.eliminar(1);

    expect(spyDelete).toHaveBeenCalledWith(1);
    expect(component.laboratorios.length).toBe(1);
    expect(component.laboratorios[0].id).toBe(2);
  });

  it('eliminar(): si delete falla, debe hacer alert()', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const alertSpy = spyOn(window, 'alert');

    spyOn(serviceMock, 'delete').and.returnValue(
      throwError(() => new Error('Delete error'))
    );

    component.laboratorios = [
      { id: 1, nombre: 'A', direccion: 'D', telefono: '1' } as unknown as Laboratorio
    ];

    component.eliminar(1);

    expect(alertSpy).toHaveBeenCalledWith('No se pudo eliminar el laboratorio.');
  });
});
