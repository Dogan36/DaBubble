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
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-dialog-user-profil',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, CommonModule, FormsModule],
  templateUrl: './dialog-user-profil.component.html',
  styleUrl: './dialog-user-profil.component.scss'
})
export class DialogUserProfilComponent {
  constructor(public authService: AuthService) {

  }

  editProfilOpen = false;
  displayName: string = '';
  email: string = '';

  editProfil() {
    this.editProfilOpen = true;
    this.displayName = this.authService.currentUser?.displayName || '';
    this.email = this.authService.currentUser?.email || '';
    console.log(this.email)
  }

  closeEditProfil() {
    this.editProfilOpen = false;
  }

  updateInfo() {
    console.log(this.email)
    this.authService.updateInfo(this.displayName, this.email)
  }
}
