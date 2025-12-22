import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { ResultadosComponent } from './resultados';
import { ResultadosService } from '../../services/resultados';
import { Resultado } from '../../models/resultado';

describe('ResultadosComponent', () => {
  let fixture: ComponentFixture<ResultadosComponent>;
  let component: ResultadosComponent;
  let service: jasmine.SpyObj<ResultadosService>;

  const mockData: Resultado[] = [
    { id: 1, laboratorioId: 1, analistaId: 10, estado: 'REGISTRADO' } as any
  ];

  beforeEach(async () => {
    service = jasmine.createSpyObj<ResultadosService>('ResultadosService', ['getAll', 'delete']);

    await TestBed.configureTestingModule({
      imports: [ResultadosComponent], // standalone component
      providers: [{ provide: ResultadosService, useValue: service }]
    }).compileComponents();

    fixture = TestBed.createComponent(ResultadosComponent);
    component = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    service.getAll.and.returnValue(of([]));
    fixture.detectChanges(); // dispara ngOnInit -> buscar()
    expect(component).toBeTruthy();
  });

  it('ngOnInit debe llamar buscar() y cargar resultados (success)', () => {
    service.getAll.and.returnValue(of(mockData));

    fixture.detectChanges(); // ngOnInit -> buscar()

    expect(service.getAll).toHaveBeenCalled();
    expect(component.resultados.length).toBe(1);
    expect(component.loading).toBeFalse();
  });

  it('buscar() si falla debe apagar loading (error)', () => {
    service.getAll.and.returnValue(throwError(() => new Error('fail')));

    component.buscar();

    expect(component.loading).toBeFalse();
  });

  it('eliminar() debe llamar delete y luego buscar()', () => {
    service.getAll.and.returnValue(of([]));
    service.delete.and.returnValue(of(null as any));

    spyOn(component, 'buscar').and.callThrough();

    component.eliminar(1);

    expect(service.delete).toHaveBeenCalledWith(1);
    expect(component.buscar).toHaveBeenCalled();
  });
});
