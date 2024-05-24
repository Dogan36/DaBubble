import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogShowProfilComponent } from '../../dialogs/dialog-show-profil/dialog-show-profil.component';
import { UserService } from '../../../services/user.service';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-workspace-user-profil',
  standalone: true,
  imports: [MatDialogModule, NgIf ],
  templateUrl: './workspace-user-profil.component.html',
  styleUrl: './workspace-user-profil.component.scss'
})
export class WorkspaceUserProfilComponent {

  @Input() userName: string = '';
  @Input() userImage: string = '';
  @Input() userId: string = '';
  @Input() ownChat: boolean = false;
  @Input() onWorkspace: boolean = false;

  constructor(public dialog: MatDialog, private userService: UserService) {}


  openShowProfilDialog(memberId: string) {
    if(this.userId && this.onWorkspace !== true) {

    let memberData = this.userService.users[this.userService.getUsersData(memberId)];

    console.log('this is the member', memberId);
    
    this.dialog.open(DialogShowProfilComponent, {panelClass: ['dialog-bor-rad-round', 'user-profil-popup'], data: {
        profilName: memberData.name,
        profilRef: memberData.id,
        profilEmail: memberData.email,
        profilImg: memberData.photoURL,
      }});
    } 
  }


  
}
