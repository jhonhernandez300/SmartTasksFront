import { Component, OnInit } from '@angular/core';
import { UsuarioTransferService } from '../../../servicios/usuario-transfer.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../general/confirm-dialog/confirm-dialog.component';
import { CloseDialogComponent } from '../../general/close-dialog/close-dialog.component';
import { iUsuarioConRolDTO } from '../../../interfaces/iUsuarioConRolDTO';
import { UsuarioService } from '../../../servicios/usuario.service';
import { RolService } from '../../../servicios/rol.service';
import { iRol } from '../../../interfaces/iRol';

@Component({
  selector: 'app-actualizar-usuario',
  templateUrl: './actualizar-usuario.component.html',
  styleUrl: './actualizar-usuario.component.css'
})
export class ActualizarUsuarioComponent implements OnInit{
  usuario: iUsuarioConRolDTO | null = null;
  myForm!: FormGroup;
  selectedRolId!: number;
  submitted = false;
  selectedUsuarioId!: number;      
  roles: iRol[] = [];

  constructor(
    private usuarioTransferService: UsuarioTransferService,    
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    public dialog: MatDialog,
    private rolService: RolService
  ){this.initializeForm();}

  ngOnInit(): void {
    this.obtenerUsuarioAEditar();
    this.obtenerTodosLosRoles();    
  }

obtenerUsuarioAEditar(): void{
  this.usuarioTransferService.currentUsuario.subscribe(usuario => {
      
    if(usuario != null){
      this.usuario = usuario;            
      this.myForm.patchValue(usuario);      
      this.selectedRolId = usuario.rolId; 
    }      
  });
}

obtenerTodosLosRoles(): void{
  this.rolService.ObtenerTodosLosRolesAsync().subscribe({
    next: (response: any) => {           
      this.roles = response.roles;
      // Una vez obtenidos los roles, establecemos el valor por defecto del dropdown
      if (this.roles) {
        // actualizamos el valor del campo RolId con el rol del usuario
        this.myForm.patchValue({ RolId: this.selectedRolId });  
      }
    },
    error: (error: any) => {        
        this.dialog.open(CloseDialogComponent, {            
          data: { message: error } 
        });
    }
  });
}

onRolChange(event: any): void {    
  this.selectedRolId = event.value;     
  this.myForm.patchValue({ RolId: this.selectedRolId });
}

  private initializeForm(): void {
    this.myForm = this.formBuilder.group({                                
      usuarioId: [this.usuario?.usuarioId],
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/), Validators.minLength(8), Validators.maxLength(30)]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30),
        this.validarContrasena 
      ]],
      rolId: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(7)]]
    });
  }

  validarContrasena(control: any) {
    const contrasena = control.value;
    const tieneMayuscula = /[A-Z]/.test(contrasena);
    const tieneMinuscula = /[a-z]/.test(contrasena);
    const tieneNumero = /\d/.test(contrasena);

    const esValido = tieneMayuscula && tieneMinuscula && tieneNumero;
    //console.log("Contraseña esValido ", esValido);
    return esValido ? null : { 'Al menos 1 mayúscula, 1 minúscula y 1 número': true };
  }


  public onReset(): void {
    this.submitted = false;
    this.myForm.reset();
  }

  public async onSubmit(): Promise<void> {
    this.submitted = true;       

    if (this.myForm.invalid) {      
      this.dialog.open(CloseDialogComponent, {            
        data: { message: "Revise los valores del formulario" } 
      });
      return;
    }             
    
    this.usuarioService.ActualizarUsuario(this.myForm.value).subscribe({
      next: (response: any) => {          
          this.dialog.open(CloseDialogComponent, {            
            data: { message: "Usuario actualizado" } 
          });
          this.myForm.reset();
      },
      error: (error: any) => {
          console.error('Error en el componente:', error);
          this.dialog.open(CloseDialogComponent, {            
            data: { message: error } 
          });
      }
  });     
  }

  get form(): { [key: string]: AbstractControl; }
  {
      return this.myForm.controls;
  }
}