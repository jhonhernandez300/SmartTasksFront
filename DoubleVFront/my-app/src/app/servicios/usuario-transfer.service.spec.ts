import { TestBed } from '@angular/core/testing';
import { UsuarioTransferService } from './usuario-transfer.service';
import { iUsuarioConRolDTO } from '../interfaces/iUsuarioConRolDTO';

describe('UsuarioTransferService', () => {
  let service: UsuarioTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioTransferService);
  });

  it('debería crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería inicializar con null en currentUsuario', (done: DoneFn) => {    
    service.currentUsuario.subscribe(value => {
      expect(value).toBeNull();
      done();
    });
  });

  it('debería actualizar el valor de currentUsuario cuando se llama a changeUsuario', (done: DoneFn) => {
    const usuarioMock: iUsuarioConRolDTO = {
      usuarioId: 1,
      nombre: 'Carlos García',
      email: 'carlos.garcia@example.com',
      password: 'password123',
      rolId: 'admin',
      ronNombre: 'Administrador'
    };
    
    service.currentUsuario.subscribe(value => {
      if (value) {
        expect(value).toEqual(usuarioMock); 
        done();
      }
    });
    
    service.changeUsuario(usuarioMock);
  });
});
