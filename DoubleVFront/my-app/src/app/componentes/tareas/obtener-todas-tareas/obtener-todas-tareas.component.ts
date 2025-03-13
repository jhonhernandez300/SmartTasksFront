import { Component, OnInit, ViewChild } from '@angular/core';
import { iUsuarioCorto } from '../../../interfaces/iUsuarioCorto';
import { iTareaConUsuarioDTO } from '../../../interfaces/iTareaConUsuarioDTO';
import { TareaService } from '../../../servicios/tarea.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../general/confirm-dialog/confirm-dialog.component';
import { CloseDialogComponent } from '../../general/close-dialog/close-dialog.component';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TareaTransferService } from '../../../servicios/tarea-transfer.service';
import { UsuarioService } from '../../../servicios/usuario.service';
import { SessionStorageService } from '../../../servicios/session-storage.service';

@Component({
  selector: 'app-obtener-todas-tareas',
  templateUrl: './obtener-todas-tareas.component.html',
  styleUrl: './obtener-todas-tareas.component.css'
})
export class ObtenerTodasTareasComponent implements OnInit {
  dataSource = new MatTableDataSource<iTareaConUsuarioDTO>([]); 
  errorMessage: string = '';  
  showDiv = false;  
  userChoice = false;
  rol: string = '';
  displayedColumns: string[] = ['descripcion', 'estado', 'usuarioNombre', 'delete', 'update'];

  @ViewChild(MatPaginator) paginator!: MatPaginator; 

  constructor(
    private router: Router,    
    private tareaService: TareaService, 
    public dialog: MatDialog,
    public tareaTransferService: TareaTransferService,
    private usuarioService: UsuarioService,
    private sessionStorageService: SessionStorageService
  ) { }

  ngOnInit(): void {
    this.rol = this.usuarioService.ObtenerRol();
    this.loadAllTareas();
  }

  public loadAllTareas(): void {
    this.tareaService.ObtenerTareasConUsuarios().subscribe(
      (response: any) => {
        if (response.message != "Tareas obtenidas exitosamente.") {
          this.handleEmpty(response.data);
        } else {           
          this.dataSource.data = response.data; // Actualiza la tabla con los datos recibidos
          this.dataSource.paginator = this.paginator; // Conecta el paginador

          console.log("rol ", this.rol);
          if(this.rol == "Empleado"){
            const id = Number(this.sessionStorageService.getData("id"));
            this.dataSource.data = response.data.filter((tarea: iTareaConUsuarioDTO) => tarea.usuarioId === id);
          }                    
        }
      },
      (error: any) => {
        this.handleError(error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
 
  update(tarea: iTareaConUsuarioDTO) {
    this.tareaTransferService.changeTarea(tarea);
    this.router.navigate(['/actualizar-tarea']);        
  }

  delete(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.userChoice = result;  
      if (this.userChoice) {
        this.deleteTarea(id);
      }
    });
  }

  deleteTarea(id: number): void {    
    this.tareaService.BorrarTarea(id).subscribe(
      (response: any) => {
        if (response.message != "Tarea eliminada exitosamente.") {
          this.dialog.open(CloseDialogComponent, {
            data: { message: response.message } 
          });
        } else {          
          this.dialog.open(CloseDialogComponent, {            
            data: { message: "Tarea borrada" } 
          });
          this.updateTareas(id);
        }
      },
      (error: any) => {
        this.handleError(error);
      }
    );
  }

  private updateTareas(id: number): void {    
    this.dataSource.data = this.dataSource.data.filter(tarea => tarea.tareaId !== id);
  }

  private handleEmpty(message: string): void {
    this.errorMessage = message;
    this.showTemporaryDiv();
  }

  private showTemporaryDiv(): void {
    this.showDiv = true;
    setTimeout(() => this.showDiv = false, 5000);
  }

  private handleError(error: any): void {
    console.error('Error:', error);
    this.errorMessage = error;
    this.showTemporaryDiv();
  }
}

