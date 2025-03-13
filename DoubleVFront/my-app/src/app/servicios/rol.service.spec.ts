// rol.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RolService } from './rol.service';
import { iRol } from '../interfaces/iRol';

describe('RolService', () => {
  let service: RolService;
  let httpTestingController: HttpTestingController;
  const apiUrl = 'https://localhost:7136/api/Roles/ObtenerTodosLosRolesAsync';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RolService]
    });
    service = TestBed.inject(RolService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verifica que no queden solicitudes pendientes
    httpTestingController.verify();
  });

  it('debería crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería retornar todos los roles (ObtenerTodosLosRolesAsync)', () => {
    const mockRoles: iRol[] = [
      { rolId: 1, nombre: 'Admin' },
      { rolId: 2, nombre: 'User' }
    ];
    
    service.ObtenerTodosLosRolesAsync().subscribe((roles) => {
      expect(roles).toEqual(mockRoles);
    });
    
    const req = httpTestingController.expectOne(apiUrl);
    
    expect(req.request.method).toBe('GET');

    // Responde con datos simulados
    req.flush(mockRoles);
  });

  it('debería manejar el error en ObtenerTodosLosRolesAsync', () => {
    service.ObtenerTodosLosRolesAsync().subscribe(
      () => fail('Esperado fallo en la solicitud'),
      (error) => {
        // Verificar que el mensaje de error contenga la cadena específica
        expect(error.message).toContain('Http failure response for https://localhost:7136/api/Roles/ObtenerTodosLosRolesAsync: 500 Internal Server Error');
      }
    );
  
    // Simula la solicitud HTTP GET con un error 500
    const req = httpTestingController.expectOne(apiUrl);
  
    expect(req.request.method).toBe('GET');
      
    req.flush({}, { status: 500, statusText: 'Internal Server Error' });
  });
});

