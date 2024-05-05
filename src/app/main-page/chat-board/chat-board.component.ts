import { Component, Input } from '@angular/core';
import { TextareaMainPageComponent } from '../shared/textarea-main-page/textarea-main-page.component';
import { WorkspaceUserProfilComponent } from '../shared/workspace-user-profil/workspace-user-profil.component';
import { MatDialog } from '@angular/material/dialog';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogShowProfilComponent } from '../dialogs/dialog-show-profil/dialog-show-profil.component';
import { ChannelService } from '../../services/channel.service';
import { UserService } from '../../services/user.service';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { MessageLeftComponent } from '../shared/message-left/message-left.component';
import { MessageRightComponent } from '../shared/message-right/message-right.component';
import { TimeSeparatorComponent } from '../shared/time-separator/time-separator.component';

@Component({
  selector: 'app-chat-board',
  standalone: true,
  imports: [TextareaMainPageComponent, WorkspaceUserProfilComponent, MatDialogModule, MessageLeftComponent, MessageRightComponent, TimeSeparatorComponent],
  templateUrl: './chat-board.component.html',
  styleUrl: './chat-board.component.scss'
})
export class ChatBoardComponent {

  channelBoard = false;
  textfieldOnUpload = false;
  privatTextarea = true;

  constructor(public dialog: MatDialog, public userService: UserService, public chatService:ChatService, public authService: AuthService, public channelService: ChannelService) {}


  openShowProfilDialog() {
    // let memberData = this.userService.users[this.userService.getUsersData(this.memberRef)];

    let memberData = this.userService.users[this.userService.getUsersData('YxHQcig7Dbb4doQCAcBmjhZjoKo2')];
    
    this.dialog.open(DialogShowProfilComponent, {panelClass: ['dialog-bor-rad-round', 'user-profil-popup'], data: {
        profilName: memberData.name,
        profilRef: memberData.id,
        profilEmail: memberData.email,
        profilImg: memberData.photoURL,
      }});
  }


  setTextfieldStatus(event: boolean) {
    this.textfieldOnUpload = event;
  }
}
