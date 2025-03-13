import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) {}

  onConfirm(): void {
    // Cerrar el diálogo con el valor true (Sí)
    this.dialogRef.close(true);  
  }

  onCancel(): void {
    // Cerrar el diálogo con el valor false (No)
    this.dialogRef.close(false);  
  }
}
