import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UsuarioService } from './usuario.service';
import { SessionStorageService } from '../servicios/session-storage.service';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let sessionStorageService: jasmine.SpyObj<SessionStorageService>;

  beforeEach(() => {
    // Crea un objeto espía para SessionStorageService
    sessionStorageService = jasmine.createSpyObj('SessionStorageService', ['getData']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      providers: [
        UsuarioService,
        { provide: SessionStorageService, useValue: sessionStorageService },
      ],
    });
    
    service = TestBed.inject(UsuarioService);
  });

  it('should return false if there is no token in session storage', () => {
    sessionStorageService.getData.and.returnValue(null); 
    expect(service.IsAuthenticated()).toBeFalse(); 
  });

  it('should return true if token is valid', () => {
    const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmF0aW9uIjp0cnVlfQ.SOME_SIGNATURE'; 
    sessionStorageService.getData.and.returnValue(validToken); 
    expect(service.IsAuthenticated()).toBeTrue(); 
  });
});
