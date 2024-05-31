import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialog,
} from '@angular/material/dialog';
import { NgFor } from '@angular/common';
import { ChangePictureService } from '../../../services/change-picture.service';
import { AuthService } from '../../../services/auth.service';
import { DialogUserProfilComponent } from '../dialog-user-profil/dialog-user-profil.component';
import { DialogUploadNewPictureComponent } from '../dialog-upload-new-picture/dialog-upload-new-picture.component';
@Component({
  selector: 'app-dialog-change-profilpic',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, NgFor],
  templateUrl: './dialog-change-profilpic.component.html',
  styleUrl: './dialog-change-profilpic.component.scss'
})

export class DialogChangeProfilpicComponent {
  constructor(public changePictureService: ChangePictureService, public authService: AuthService, public dialog: MatDialog,) { }

  openUserProfilDialog() {
    if (window.innerWidth > 544) {
      this.dialog.open(DialogUserProfilComponent, { position: { right: '24px', top: '80px' }, panelClass: 'dialog-bor-rad-corner' });
    } else if (window.innerWidth <= 544) {
      this.dialog.open(DialogUserProfilComponent, { panelClass: ['dialog-bor-rad-corner', 'user-profil-popup'] });
    }
  }

  openUploadPicture() {
    if (window.innerWidth > 544) {
      this.dialog.open(DialogUploadNewPictureComponent, { position: { right: '24px', top: '80px' }, panelClass: ['dialog-bor-rad-corner', 'user-profil-menu'] });
    } else if (window.innerWidth <= 544) {
      this.dialog.open(DialogUploadNewPictureComponent, { panelClass: ['dialog-bor-rad-corner', 'user-profil-popup'] });
    }
  }
}



