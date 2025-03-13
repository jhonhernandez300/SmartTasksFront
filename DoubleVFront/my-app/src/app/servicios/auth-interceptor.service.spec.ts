// auth-interceptor.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { AuthInterceptorService } from './auth-interceptor.service';
import { SessionStorageService } from './session-storage.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpRequest, HttpHandler } from '@angular/common/http';
import { of } from 'rxjs';

describe('AuthInterceptorService', () => {
  let service: AuthInterceptorService;
  let sessionStorageService: jasmine.SpyObj<SessionStorageService>;
  let router: jasmine.SpyObj<Router>;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    const sessionStorageSpy = jasmine.createSpyObj('SessionStorageService', ['getData']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
        { provide: SessionStorageService, useValue: sessionStorageSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthInterceptorService);
    sessionStorageService = TestBed.inject(SessionStorageService) as jasmine.SpyObj<SessionStorageService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should redirect to login if token is expired', () => {
    sessionStorageService.getData.and.returnValue('expiredToken');
    spyOn(service as any, 'isTokenExpired').and.returnValue(true);

    httpClient.get('/test').subscribe({
      next: () => fail('Should have failed with 401 error'),
      error: () => { }
    });

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBeFalse();
  });

  it('should handle requests without token and redirect on 401 or 403 error', () => {
    sessionStorageService.getData.and.returnValue(null);

    httpClient.get('/test').subscribe({
      next: () => fail('Should have failed with 401 error'),
      error: () => { }
    });

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBeFalse();

    req.flush(null, { status: 401, statusText: 'Unauthorized' });
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should pass through the request without adding Authorization header if no token is present', () => {
    sessionStorageService.getData.and.returnValue(null);

    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBeFalse();
  });
});

