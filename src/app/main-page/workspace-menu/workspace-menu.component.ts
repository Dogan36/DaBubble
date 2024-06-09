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


  /**
   * Starts a subscription of chats$ and defines this.chats
   */
  ngOnInit() {
    this.chatSubscription = this.chatService.chats$.subscribe(chats => {
      this.chats = chats;
    });
  }
  

  /**
   * On destroy chatSubscription is unsubscribed
   */
  ngOnDestroy() {
    this.chatSubscription?.unsubscribe();
  }


  /**
   * toggels channelListOpen boolean variable
   */
  toggleChannelList() {
    this.channelListOpen = !this.channelListOpen;
  }


  /**
   * toggels messageListOpen boolean variable
   */
  toggleMessageList() {
    this.messageListOpen = !this.messageListOpen;
  }


  /**
   * Emits to parent element
   */
  onOpenNewChat() {
    this.openNewChat.emit();
  }


  /**
   * Unsubscribes old chats and subscribes selected channel chats and calls parent element to open channel board with selected channel
   * 
   * @param i - index of selected channel
   * @param channelRef - selected channel documents ref
   */
  onOpenChannel(i:number, channelRef:string) {
    this.channelService.unsubSglChannelChats();
    this.channelService.subSglChannelChats(channelRef);
    this.channelService.selectedChannel = i;
    this.openChannel.emit();
  }


  /**
   * Unsubscribes old private chat and subscribes selected chat and calls parent element to open chat board with selected chat
   * 
   * @param chat - selected chat object
   * @param index - index of selected chat form chats array
   */
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