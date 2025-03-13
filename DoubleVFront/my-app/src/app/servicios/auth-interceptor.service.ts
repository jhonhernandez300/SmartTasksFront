import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs"; // Cambio: Importar throwError
import { Router } from "@angular/router";
import { SessionStorageService } from "./session-storage.service";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from "@angular/common/http"; // Cambio: Importar HttpErrorResponse
import { catchError } from "rxjs/operators"; 

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
      private router: Router,
      private sessionStorageService: SessionStorageService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const token = this.sessionStorageService.getData("token");

      if (token) {                  
          if (this.isTokenExpired(token)) {              
              this.router.navigate(['/login']);
              return next.handle(req); 
          }
          
          const cloned = req.clone({
              setHeaders: { Authorization: `Bearer ${token}` }
          });
          
          return next.handle(cloned).pipe(
              catchError((error: HttpErrorResponse) => {
                console.log("error.status ", error.status);
                  if (error.status === 401 || error.status === 403) {
                      // Redirigir al login si el token no es válido o está expirado
                      this.router.navigate(['/login']);
                  }
                  return throwError(error); 
              })
          );
      } else {          
          // Manejar también las respuestas sin token
          return next.handle(req).pipe(
              catchError((error: HttpErrorResponse) => {
                console.log("error.status ", error.status);
                  if (error.status === 401 || error.status === 403) {                      
                      this.router.navigate(['/login']);
                  }
                  return throwError(error); 
              })
          );
      }
  }

  private isBase64(str: string): boolean {
      try {
          return btoa(atob(str)) === str;
      } catch (err) {
          return false;
      }
  }

  private isTokenExpired(token: string): boolean {
      try {
        // Decodificar el payload del token
          const payload = JSON.parse(atob(token.split('.')[1])); 
          const expiry = payload.exp;           
          return (Math.floor((new Date).getTime() / 1000)) >= expiry; 
      } catch (e) {
          console.error("Error parsing token payload:", e);          
          return true; 
      }
  }
}
