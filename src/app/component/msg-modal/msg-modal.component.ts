import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-msg-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './msg-modal.component.html',
  styleUrl: './msg-modal.component.scss',
})
export class MsgModalComponent {
  constructor(
    public matDialogRef: MatDialogRef<MsgModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.closeDialogDelayed();
  }

  closeDialig(): void {
    this.matDialogRef.close();
  }

  closeDialogDelayed(): void {
    setTimeout(() => {
      this.matDialogRef.close();
    }, 2500);
  }
}
