import { Component } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogUserProfilComponent } from '../dialog-user-profil/dialog-user-profil.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dialog-user-menu',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogModule],
  templateUrl: './dialog-user-menu.component.html',
  styleUrl: './dialog-user-menu.component.scss'
})
export class DialogUserMenuComponent {
  dialogRef: MatDialogRef<DialogUserMenuComponent> | undefined;
  constructor(public dialog: MatDialog, public authService: AuthService) { }


  openUserProfilDialog() {
    if (window.innerWidth > 544) {
        this.dialog.open(DialogUserProfilComponent, { position: { right: '24px', top: '80px' }, panelClass: 'dialog-bor-rad-corner' });
    } else if (window.innerWidth <= 544) {
        this.dialog.open(DialogUserProfilComponent, { panelClass: ['dialog-bor-rad-corner', 'user-profil-popup'] });
    }
  }


  closeDialog(){
    this.dialog.closeAll(); 
  }
}
