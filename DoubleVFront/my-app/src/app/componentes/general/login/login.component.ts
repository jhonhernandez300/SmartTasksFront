import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../servicios/usuario.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { iLogin } from '../../../interfaces/iLogin';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SessionStorageService } from '../../../servicios/session-storage.service';
import { CloseDialogComponent } from '../close-dialog/close-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  myForm: FormGroup = this.formBuilder.group({});
  submitted = false; 
  emailChecked = false;
  errorMessage: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,        
    private router: Router,
    private sessionStorageService: SessionStorageService,
    public dialog: MatDialog
    ){      
  }

  iniciarFormulario(){
    this.myForm = this.formBuilder.group({                   
      Password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]],
      Correo: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/), Validators.minLength(8), Validators.maxLength(30)]]
    });
  }

  ngOnInit(): void {
    this.iniciarFormulario();
  }

  validarContrasena(control: any) {
    const contrasena = control.value;
    const tieneMayuscula = /[A-Z]/.test(contrasena);
    const tieneMinuscula = /[a-z]/.test(contrasena);
    const tieneNumero = /\d/.test(contrasena);

    const esValido = tieneMayuscula && tieneMinuscula && tieneNumero;

    return esValido ? null : { 'Al menos 1 mayúscula, 1 minúscula y 1 número': true };
  }

  get form(): { [key: string]: AbstractControl; }
  {
      return this.myForm.controls;
  }

  onReset(): void {
    this.submitted = false;
    this.myForm.reset();          
    this.emailChecked = false;
  }

  onSubmit() {
    this.submitted = true;
    //console.log("Form value ", this.myForm.value);            

    if (this.myForm.valid) {      

      this.usuarioService.Login(this.myForm.value).subscribe(
        (response: any) => {                    
          //Acceder al token con un servicio inyectado
          this.sessionStorageService.setToken('token', response.token);
          var tokenAdquirido = this.usuarioService.getRoleFromToken(response.token);
          this.sessionStorageService.setData('rol', tokenAdquirido);
          var usuarioId = response.usuarioId;
          this.sessionStorageService.setData('id', usuarioId);
          const currentDate = new Date();
          const dateString = currentDate.toISOString();        
          localStorage.setItem('last date', dateString);                    
          this.router.navigate(['/obtener-todas-tareas']); 
        },
        (error: any) => {          
          const errorMessage = error.message || 'Error en el inicio de sesión';
          this.dialog.open(CloseDialogComponent, {            
            data: { message: error } 
          });
        }
      );
    }else{
      this.dialog.open(CloseDialogComponent, {            
        data: { message: "Revise los valores del formulario" } 
      });
    }
  }

}
