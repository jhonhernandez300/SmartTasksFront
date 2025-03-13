import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-close-dialog',
  templateUrl: './close-dialog.component.html',
  styleUrl: './close-dialog.component.css'
})
export class CloseDialogComponent {
  constructor(public dialogRef: MatDialogRef<CloseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }) {}

  onClose(): void {
    // Cierra el diálogo sin pasar ningún valor
    this.dialogRef.close();  
  }
}
