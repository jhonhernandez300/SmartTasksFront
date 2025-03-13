import { TestBed } from '@angular/core/testing';
import { TareaTransferService } from './tarea-transfer.service';
import { iTareaConUsuarioDTO } from '../interfaces/iTareaConUsuarioDTO';

describe('TareaTransferService', () => {
  let service: TareaTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TareaTransferService);
  });

  it('debería crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería inicializar con null en currentTarea', (done: DoneFn) => {
    // currentTarea debería tener un valor inicial de null
    service.currentTarea.subscribe(value => {
      expect(value).toBeNull();
      done();
    });
  });

  it('debería actualizar el valor de currentTarea cuando se llama a changeTarea', (done: DoneFn) => {
    const tareaMock: iTareaConUsuarioDTO = {
      tareaId: 1,
      descripcion: 'Tarea de prueba',
      estado: 'Pendiente',
      usuarioId: 123,
      usuarioNombre: 'Juan Pérez'
    };

    // Suscribirse a currentTarea para comprobar el cambio
    service.currentTarea.subscribe(value => {
      if (value) {
        expect(value).toEqual(tareaMock);  
        done();
      }
    });

    // Cambiar el valor de la tarea usando changeTarea
    service.changeTarea(tareaMock);
  });
});
