import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { iRol } from '../interfaces/iRol';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private apiUrl = 'https://localhost:7136/api/Roles'; 

  constructor(private http: HttpClient) { }

  ObtenerTodosLosRolesAsync(): Observable<any> {             
    return this.http.get(`${this.apiUrl}/ObtenerTodosLosRolesAsync`).pipe(
      catchError(error => {
          console.error('Request error:', error);
          return throwError(error);
      })    
    );    
  }
}
