import { TestBed } from '@angular/core/testing';
import { SessionStorageService } from './session-storage.service';

describe('SessionStorageService', () => {
  let service: SessionStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionStorageService],
    });
    service = TestBed.inject(SessionStorageService);
  });

  it('debería crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería guardar datos en sessionStorage', () => {
    const spy = spyOn(sessionStorage, 'setItem');
    const key = 'userData';
    const data = JSON.stringify({ name: 'John', age: 30 });

    service.setData(key, data);

    expect(spy).toHaveBeenCalledWith(key, data);
  });

  it('debería verificar si sessionStorage está vacío', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue(null);  // Simula que no hay datos en el sessionStorage
    
    const result = service.isEmpty();
    
    expect(result).toBeTrue();
  });
});
