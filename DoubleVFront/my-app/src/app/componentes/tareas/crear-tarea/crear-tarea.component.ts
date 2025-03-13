import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TareaService } from '../../../servicios/tarea.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../general/confirm-dialog/confirm-dialog.component';
import { CloseDialogComponent } from '../../general/close-dialog/close-dialog.component';
import { iTarea } from '../../../interfaces/iTarea';
import { UsuarioTransferService } from '../../../servicios/usuario-transfer.service';
import { iUsuarioConRolDTO } from '../../../interfaces/iUsuarioConRolDTO';

@Component({
  selector: 'app-crear-tarea',
  templateUrl: './crear-tarea.component.html',
  styleUrls: ['./crear-tarea.component.css']
})
export class CrearTareaComponent implements OnInit{
  myForm!: FormGroup; 
  submitted = false;
  tareaIdSeleccionada!: number;
  usuario: iUsuarioConRolDTO | null = null;
  selectedUsuarioId!: number;
  tareas: iTarea[] = [];
  
  constructor(
    private formBuilder: FormBuilder,
    private tareaService: TareaService,
    private router: Router,
    public dialog: MatDialog,
    private usuarioTransferService: UsuarioTransferService 
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {   
    this.initializeForm();
    
    this.usuarioTransferService.currentUsuario.subscribe(usuario => {
      
      if(usuario != null){
        this.usuario = usuario;         
      }      
    });
  }

  private initializeForm(): void {
    this.myForm = this.formBuilder.group({                                      
      descripcion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      estado: ['En Proceso'],
      usuarioId: ['']
    });
  }

  public onReset(): void {
    this.submitted = false;
    this.myForm.reset();
  }

  public async onSubmit(): Promise<void> {
    this.submitted = true;
    this.myForm.patchValue({
      usuarioId: null 
    });         

    if (this.myForm.invalid) {      
      this.dialog.open(CloseDialogComponent, {            
        data: { message: "Revise los valores del formulario" } 
      });
      return;
    }             
    
    this.myForm.patchValue({
      usuarioId: this.usuario?.usuarioId
    });    
    
    this.tareaService.CrearTarea(this.myForm.value).subscribe({
      next: (response: any) => {          
          this.dialog.open(CloseDialogComponent, {            
            data: { message: "Tarea creada" } 
          });
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
