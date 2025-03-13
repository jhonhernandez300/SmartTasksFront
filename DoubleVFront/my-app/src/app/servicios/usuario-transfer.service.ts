import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { iUsuarioConRolDTO } from '../interfaces/iUsuarioConRolDTO'; 


@Injectable({
  providedIn: 'root'
})
export class UsuarioTransferService {
  private usuarioSource = new BehaviorSubject<iUsuarioConRolDTO | null>(null);
  currentUsuario = this.usuarioSource.asObservable();

  constructor() { }

  changeUsuario(usuario: iUsuarioConRolDTO) {    
    this.usuarioSource.next(usuario);
  }
}
