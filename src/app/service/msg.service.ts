import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MsgModalComponent } from '../../app/component/msg-modal/msg-modal.component';

@Injectable({
  providedIn: 'root',
})
export class MsgService {
  constructor(public msgModal: MatDialog) {}

  private dialogCount = 0;

  openMsgModal(condition: string, message: string[]): void {
    const dialogRef = this.msgModal.open(MsgModalComponent, {
      data: {
        condition: condition,
        message: message,
      },
      // No overlay
      hasBackdrop: false,
      position: { bottom: `${this.dialogCount * 80 + 40}px` },
      autoFocus: false,
      panelClass: 'msgModal-container',
    });

    this.dialogCount++;

    dialogRef.afterClosed().subscribe(() => {
      this.dialogCount--;
    });
  }
}
