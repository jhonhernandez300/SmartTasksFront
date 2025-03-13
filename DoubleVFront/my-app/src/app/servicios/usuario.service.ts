import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { iUsuario } from '../interfaces/iUsuario';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { iUsuarioSinIdDTO } from '../interfaces/iUsuarioSinIdDTO';
import { iUsuarioConRolDTO } from '../interfaces/iUsuarioConRolDTO';
import { iLogin } from '../interfaces/iLogin';
import { SessionStorageService } from '../servicios/session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public apiUrl = 'https://localhost:7136/api/Usuarios'; 

  constructor(private http: HttpClient, private sessionStorageService: SessionStorageService) { }

  ActualizarUsuario(usuario: iUsuarioConRolDTO): Observable<any> {             
    return this.http.put(`${this.apiUrl}/ActualizarUsuario/${usuario.usuarioId}`, usuario).pipe(
      catchError(error => {
          console.error('Request error:', error);
          return throwError(error);
      })    
    );    
  }

  ObtenerRol(): string {    
    return this.sessionStorageService.getData('rol');
  }

  public getDecodedAccessToken(token: string): any {
    if (token) {
      // Obtén la parte del payload
      const jwtData = token.split('.')[1]; 
      // Decodifica en base64
      const decodedJwtJsonData = window.atob(jwtData); 
      return JSON.parse(decodedJwtJsonData); 
    }
    return null;
  }
  
  public getRoleFromToken(token: string): string | null {
    const decodedToken = this.getDecodedAccessToken(token);    
    const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];    
    return role ? role : null; 
  }

  Login(login: iLogin): Observable<any> {            
    return this.http.post(`${this.apiUrl}/Login`, login).pipe(
      catchError(error => {
          console.error('Request error:', error);
          const errorMessage = error?.error?.message || 'Error en la solicitud';
          return throwError(() => new Error(errorMessage));
      })    
    );    
  }

  BorrarUsuario(id: number): Observable<any> {             
    return this.http.delete(`${this.apiUrl}/BorrarUsuario` + "/" + id).pipe(
      catchError(error => {
          console.error('Request error:', error);
          return throwError(error);
      })    
    );    
  }

  CrearUsuario(usuario: iUsuarioSinIdDTO): Observable<any> {             
    return this.http.post(`${this.apiUrl}/CrearUsuario`, usuario).pipe(
      catchError(error => {
          console.error('Request error:', error);
          return throwError(error);
      })    
    );    
  }

  ObtenerTodosLosUsuariosAsync(): Observable<any> {             
    return this.http.get(`${this.apiUrl}/ObtenerTodosLosUsuariosAsync`).pipe(
      catchError(error => {
          console.error('Request error:', error);
          return throwError(error);
      })    
    );    
  }

  IsAuthenticated(): boolean {
    const token = this.sessionStorageService.getData('token');

    if (!token) {
      // No hay token, no autenticado
      return false; 
    }
    
    if (this.isTokenExpired(token)) {
      return false; 
    }

    // Token válido
    return true; 
  }  

  public isTokenExpired(token: string): boolean {
    try {      
      const payload = JSON.parse(atob(token.split('.')[1])); 
      const expiry = payload.exp; 
      // Hora actual en segundos
      const currentTime = Math.floor((new Date).getTime() / 1000); 
      // Comprobar si el token ha expirado
      return currentTime >= expiry; 
    } catch (e) {
      console.error("Error parsing token payload:", e);          
      // Considerar token como expirado si no se puede parsear
      return true; 
    }
  }
}