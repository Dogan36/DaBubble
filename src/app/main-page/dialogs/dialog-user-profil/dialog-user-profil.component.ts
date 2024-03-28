import { Component } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-user-profil',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogClose],
  templateUrl: './dialog-user-profil.component.html',
  styleUrl: './dialog-user-profil.component.scss'
})
export class DialogUserProfilComponent {

  editProfilOpen = false;


  editProfil() {
    this.editProfilOpen = true;
  }

  closeEditProfil() {
    this.editProfilOpen = false;
  }
}
