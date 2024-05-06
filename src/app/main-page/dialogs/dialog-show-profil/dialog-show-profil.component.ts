import { Component, Inject } from '@angular/core';
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
import { ChatService } from '../../../services/chat.service';
import { AuthService } from '../../../services/auth.service';
import { EventService } from '../../../services/event.service';
import { timestamp } from 'rxjs';

@Component({
  selector: 'app-dialog-show-profil',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose],
  templateUrl: './dialog-show-profil.component.html',
  styleUrl: './dialog-show-profil.component.scss'
})
export class DialogShowProfilComponent {

  constructor(public usersService: UserService, private chatService: ChatService, private authService: AuthService, private evtSvc: EventService, @Inject(MAT_DIALOG_DATA) public data: {
        profilName: string,
        profilRef: string,
        profilEmail: string,
        profilImg: string,
      }) { }


  startPrivateChat() {

    if(!this.chatService.searchForMemberInChats(this.data.profilRef)) {

      this.chatService.startNewPrivateChat({members: [this.authService.uid, this.data.profilRef], timestamp: Date.now()})
    } 
    // open privateChat mit chat infos!

    this.evtSvc.openChannel(false);
    this.evtSvc.openPrivateChat(true);
    this.evtSvc.openNewChat(false);
    this.evtSvc.openThread(false);

    if (window.innerWidth <= 544) {
      this.evtSvc.openWorkspace(false);
    }
  }
}
