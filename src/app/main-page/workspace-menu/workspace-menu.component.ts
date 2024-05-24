import { Component, Output, EventEmitter } from '@angular/core';
import { WorkspaceUserProfilComponent } from '../shared/workspace-user-profil/workspace-user-profil.component';
import { MatDialog } from '@angular/material/dialog';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogAddChannelComponent } from '../dialogs/dialog-add-channel/dialog-add-channel.component';
import { UserService } from '../../services/user.service';
import { ChannelService } from '../../services/channel.service';
import { ChatService } from '../../services/chat.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SearchInputComponent } from '../shared/search-input/search-input.component';


@Component({
  selector: 'app-workspace-menu',
  standalone: true,
  imports: [WorkspaceUserProfilComponent, MatDialogModule, SearchInputComponent],
  templateUrl: './workspace-menu.component.html',
  styleUrl: './workspace-menu.component.scss'
})
export class WorkspaceMenuComponent {

  channelListOpen = true;
  messageListOpen = true;
  chats: any[] = [];
  @Output() openChannel = new EventEmitter<void>();
  @Output() openPrivateChat = new EventEmitter<void>();
  @Output() openNewChat = new EventEmitter<void>();
  private chatSubscription: Subscription | undefined;


  constructor(public dialog: MatDialog, public usersService: UserService, public channelService: ChannelService, public chatService: ChatService, public authService: AuthService) {}

  ngOnInit() {
    this.chatSubscription = this.chatService.chats$.subscribe(chats => {
      this.chats = chats;
    });
  }
  
  ngOnDestroy() {
    this.chatSubscription?.unsubscribe();
  }

  toggleChannelList() {
    this.channelListOpen = !this.channelListOpen;
  }

  toggleMessageList() {
    this.messageListOpen = !this.messageListOpen;
  }


  onOpenNewChat() {
    this.openNewChat.emit();
  }


  onOpenChannel(i:number, channelRef:string) {
    this.channelService.unsubSglChannelChats();
    this.channelService.subSglChannelChats(channelRef);
    this.channelService.selectedChannel = i;
    this.openChannel.emit();
  }


  onOpenPrivateChat(chat: any, index: number) {
    if(this.chatService.unsubPrivateChatMessages) {
      this.chatService.unsubPrivateChatMessages();
    }
    this.chatService.currentChat = chat;
    this.chatService.selChatIndex = index;
    this.chatService.selChatRef = chat.chatRef;
    this.chatService.getPrivateChatMessages(chat);
    this.openPrivateChat.emit();
  }


  /**
   * Opens AddChannelDialog by click
   */
  openAddChannelDialog() {
    this.dialog.open(DialogAddChannelComponent, {panelClass: 'dialog-bor-rad-round'});
  }

}


