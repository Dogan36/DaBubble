import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { NgFor } from '@angular/common';
import { ChangePictureService } from '../../../services/change-picture.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dialog-change-profilpic',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, NgFor],
  templateUrl: './dialog-change-profilpic.component.html',
  styleUrl: './dialog-change-profilpic.component.scss'
})

export class DialogChangeProfilpicComponent {
constructor(public changePictureService: ChangePictureService, public authService: AuthService){}
}


 
