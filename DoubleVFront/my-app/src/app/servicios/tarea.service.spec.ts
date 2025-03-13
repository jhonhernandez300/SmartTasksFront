import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { iTareaConUsuarioDTO } from '../interfaces/iTareaConUsuarioDTO';
import { TareaService } from './tarea.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('TareaService', () => {
  let service: TareaService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TareaService]
    });
    service = TestBed.inject(TareaService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
     // Verifica que no haya solicitudes pendientes después de cada prueba
    httpTestingController.verify();
  });

  it('debería enviar una solicitud PUT para actualizar la tarea', () => {
    const mockTarea: iTareaConUsuarioDTO = {
      tareaId: 1,
      descripcion: 'Nueva descripción',
      estado: 'En progreso',
      usuarioId: 123,
      usuarioNombre: 'Usuario de Prueba'
    };

    const mockResponse = { mensaje: 'Tarea actualizada exitosamente' };

    service.ActualizarTarea(mockTarea).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${service['apiUrl']}/ActualizarTarea/${mockTarea.tareaId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockTarea);
    
    // Simula una respuesta de éxito
    req.flush(mockResponse);
  });

  it('debería manejar un error de solicitud PUT', () => {
    const mockTarea: iTareaConUsuarioDTO = {
      tareaId: 1,
      descripcion: 'Nueva descripción',
      estado: 'En progreso',
      usuarioId: 123,
      usuarioNombre: 'Usuario de Prueba'
    };

    const mockErrorResponse = new HttpErrorResponse({
      error: 'Error al actualizar la tarea',
      status: 500,
      statusText: 'Internal Server Error'
    });

    service.ActualizarTarea(mockTarea).subscribe(
      () => fail('Se esperaba un error, no una respuesta exitosa'),
      (error) => {
        expect(error).toBeTruthy();
        expect(error.status).toBe(500);
        expect(error.error).toBe('Error al actualizar la tarea');
      }
    );

    const req = httpTestingController.expectOne(`${service['apiUrl']}/ActualizarTarea/${mockTarea.tareaId}`);
    expect(req.request.method).toBe('PUT');
    
    // Simula una respuesta de error
    req.flush(mockErrorResponse.error, { status: mockErrorResponse.status, statusText: mockErrorResponse.statusText });
  });
});