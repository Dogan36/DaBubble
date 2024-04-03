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
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-dialog-show-profil',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose],
  templateUrl: './dialog-show-profil.component.html',
  styleUrl: './dialog-show-profil.component.scss'
})
export class DialogShowProfilComponent {

  constructor(public usersService: UserService) { }

}
