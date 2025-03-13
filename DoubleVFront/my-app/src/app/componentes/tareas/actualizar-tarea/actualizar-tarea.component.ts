import { Component, OnInit } from '@angular/core';
import { TareaTransferService } from '../../../servicios/tarea-transfer.service';
import { iTareaConUsuarioDTO } from '../../../interfaces/iTareaConUsuarioDTO';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TareaService } from '../../../servicios/tarea.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../general/confirm-dialog/confirm-dialog.component';
import { CloseDialogComponent } from '../../general/close-dialog/close-dialog.component';
import { iTarea } from '../../../interfaces/iTarea';
import { iUsuarioConRolDTO } from '../../../interfaces/iUsuarioConRolDTO';

@Component({
  selector: 'app-actualizar-tarea',
  templateUrl: './actualizar-tarea.component.html',
  styleUrl: './actualizar-tarea.component.css'
})
export class ActualizarTareaComponent implements OnInit{
  tarea: iTareaConUsuarioDTO | null = null;
  myForm!: FormGroup;
  selectedEstadoId!: number;
  submitted = false;
  tareaIdSeleccionado!: number;    
  estados = ['Pendiente', 'En proceso', 'Completado'];

  constructor(
    private tareaTransferService: TareaTransferService,
    private formBuilder: FormBuilder,
    private tareaService: TareaService,
    private router: Router,
    public dialog: MatDialog
  ){this.initializeForm();}

  ngOnInit() {
    this.tareaTransferService.currentTarea.subscribe(tarea => {
      
      if(tarea != null){
        this.tarea = tarea;        
        this.myForm.patchValue(tarea);        
      }      
    });    
    this.initializeForm();
  }
  private initializeForm(): void {
    this.myForm = this.formBuilder.group({                                
      tareaId: [this.tarea?.tareaId],
      descripcion: [this.tarea?.descripcion,[Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      estado: [this.tarea?.estado],
      usuarioId: [this.tarea?.usuarioId],
      usuarioNombre: [this.tarea?.usuarioNombre]
    });
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
    
    this.tareaService.ActualizarTarea(this.myForm.value).subscribe({
      next: (response: any) => {          
          this.dialog.open(CloseDialogComponent, {            
            data: { message: "Tarea actualizada" } 
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
