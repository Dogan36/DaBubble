import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
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
    if (!this.chatService.searchForMemberInChats(this.data.profilRef)) {
      if (this.chatService.unsubPrivateChatMessages) {
        this.chatService.unsubPrivateChatMessages();
      }
      this.chatService.startNewPrivateChat({ members: [this.authService.uid, this.data.profilRef], timestamp: Date.now() }, 'chats');
    } else {
      if (this.chatService.unsubPrivateChatMessages) {
        this.chatService.unsubPrivateChatMessages();
      }
      this.chatService.selChatIndex = this.chatService.getSelChatIndex(this.data.profilRef);
      this.chatService.selChatRef = this.chatService.privateChats[this.chatService.selChatIndex].chatId;
      this.chatService.currentChat = this.chatService.privateChats[this.chatService.selChatIndex];
      this.chatService.getPrivateChatMessages(this.chatService.currentChat);
      this.evtSvc.PrivateChatModus();
    }
  }
}
