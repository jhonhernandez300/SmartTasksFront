import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../../servicios/usuario.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../general/confirm-dialog/confirm-dialog.component';
import { CloseDialogComponent } from '../../general/close-dialog/close-dialog.component';
import { iUsuarioSinIdDTO } from '../../../interfaces/iUsuarioSinIdDTO';
import { UsuarioTransferService } from '../../../servicios/usuario-transfer.service';
import { RolService } from '../../../servicios/rol.service';
import { iRol } from '../../../interfaces/iRol';

@Component({
  selector: 'app-guardar-usuario',
  templateUrl: './guardar-usuario.component.html',
  styleUrl: './guardar-usuario.component.css'
})
export class GuardarUsuarioComponent implements OnInit{
  myForm!: FormGroup; 
  submitted = false; 
  selectedUsuarioId!: number;
  selectedRolId: number = 0;
  roles: iRol[] = [];
  
  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    public dialog: MatDialog,
    private usuarioTransferService: UsuarioTransferService,
    private rolService: RolService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {   
    this.rolService.ObtenerTodosLosRolesAsync().subscribe({
      next: (response: any) => {             
        this.roles = response.roles;
        
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
        data: { message: "Revisa los valores del formulario" } 
      });
      return;
    }             
    
    this.usuarioService.CrearUsuario(this.myForm.value).subscribe({
      next: (response: any) => {          
          this.dialog.open(CloseDialogComponent, {            
            data: { message: "Usuario creado" } 
          });
          this.myForm.reset();
      },
      error: (error: any) => {          
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

