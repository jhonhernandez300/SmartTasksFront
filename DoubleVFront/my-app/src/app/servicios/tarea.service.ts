import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { iTareaDTO } from '../interfaces/iTareaDTO';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { iTareaConUsuarioDTO } from '../interfaces/iTareaConUsuarioDTO';

@Injectable({
  providedIn: 'root'
})
export class TareaService {
  private apiUrl = 'https://localhost:7136/api/Tareas'; 

  constructor(private http: HttpClient) { }

  ActualizarTarea(tarea: iTareaConUsuarioDTO): Observable<any> {                
    return this.http.put(`${this.apiUrl}/ActualizarTarea/${tarea.tareaId}`, tarea).pipe(
      catchError(error => {
          console.error('Request error:', error);
          return throwError(error);
      })    
    );    
  }

  BorrarTarea(id: number): Observable<any> {                
    return this.http.delete(`${this.apiUrl}/BorrarTarea/${id}`).pipe(
      catchError(error => {
          console.error('Request error:', error);
          return throwError(error);
      })    
    );    
  }

  ObtenerTareasConUsuarios(): Observable<any> {             
    return this.http.get(`${this.apiUrl}/ObtenerTareasConUsuarios`).pipe(
      catchError(error => {
          console.error('Request error:', error);
          return throwError(error);
      })    
    );    
  }

  CrearTarea(tarea: iTareaDTO): Observable<any> {         
    console.log(tarea);
    return this.http.post(`${this.apiUrl}/CrearTarea`, tarea).pipe(
      catchError(error => {
          console.error('Request error:', error);
          return throwError(error);
      })    
    );    
  }
}
