import { Component, ViewChild, ElementRef } from '@angular/core';
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

  @ViewChild('privateChatsContainer') privateChatsContainerRef?: ElementRef;


  constructor(public dialog: MatDialog, public userService: UserService, public chatService:ChatService, public authService: AuthService, public channelService: ChannelService) {}


  openShowProfilDialog(memberId: string) {

    let memberData = this.userService.users[this.userService.getUsersData(memberId)];
    
    this.dialog.open(DialogShowProfilComponent, {panelClass: ['dialog-bor-rad-round', 'user-profil-popup'], data: {
        profilName: memberData.name,
        profilRef: memberData.id,
        profilEmail: memberData.email,
        profilImg: memberData.photoURL,
      }});
  }


  scrollToBottom(): void {
    if (this.privateChatsContainerRef) {
      const containerElement = this.privateChatsContainerRef.nativeElement;
      containerElement.scrollTop = containerElement.scrollHeight;
      console.log('Die Höhe ist ', containerElement.scrollHeight);
    }
  }


  setTextfieldStatus(event: boolean) {
    this.textfieldOnUpload = event;
  }
}
