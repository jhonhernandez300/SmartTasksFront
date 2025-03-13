import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { iTareaConUsuarioDTO } from '../interfaces/iTareaConUsuarioDTO'; 


@Injectable({
  providedIn: 'root'
})
export class TareaTransferService {
  private tareaSource = new BehaviorSubject<iTareaConUsuarioDTO | null>(null);
  currentTarea = this.tareaSource.asObservable();

  constructor() { }

  changeTarea(tarea: iTareaConUsuarioDTO) {    
    this.tareaSource.next(tarea);
  }
}

