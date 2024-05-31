import { Component } from '@angular/core';
import {
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialog,
  MatDialogModule
} from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogChangeProfilpicComponent } from '../dialog-change-profilpic/dialog-change-profilpic.component';
import { ChangePictureService } from '../../../services/change-picture.service';

@Component({
  selector: 'app-dialog-user-profil',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, CommonModule, FormsModule, MatDialogModule],
  templateUrl: './dialog-user-profil.component.html',
  styleUrl: './dialog-user-profil.component.scss'
})
export class DialogUserProfilComponent {
  constructor(public authService: AuthService, public dialog: MatDialog, public pictureService: ChangePictureService) {

  }

  editProfilOpen = false;
  displayName: string = '';
  email: string = '';
  picture: string = '';
  editProfil() {
    this.editProfilOpen = true;
    this.displayName = this.authService.currentUser?.name || '';
    this.email = this.authService.currentUser?.email || '';

  }


closeEditProfil() {
  this.editProfilOpen = false;
}

updateInfo() {
  this.authService.updateInfo(this.displayName, this.email);
}

openChooseImg() {
  this.dialog.open(DialogChangeProfilpicComponent, { position: { right: '24px', top: '80px' }, panelClass: ['dialog-bor-rad-corner', 'user-profil-menu'] });
}


}
