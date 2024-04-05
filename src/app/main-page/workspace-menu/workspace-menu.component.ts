import { Component, Output, EventEmitter } from '@angular/core';
import { WorkspaceUserProfilComponent } from '../shared/workspace-user-profil/workspace-user-profil.component';
import { MatDialog } from '@angular/material/dialog';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogAddChannelComponent } from '../dialogs/dialog-add-channel/dialog-add-channel.component';
import { UserService } from '../../services/user.service';
import { ChannelService } from '../../services/channel.service';
import { ChatService } from '../../services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-workspace-menu',
  standalone: true,
  imports: [WorkspaceUserProfilComponent, MatDialogModule,],
  templateUrl: './workspace-menu.component.html',
  styleUrl: './workspace-menu.component.scss'
})
export class WorkspaceMenuComponent {

  channelListOpen = true;
  messageListOpen = true;
  public messagesWithUsernames: { message: any, username: string }[] = [];
  // So muss die Funktion mit Parameter aussehen!
  // @Output() openChannel = new EventEmitter<any>();
  // evtl doch mit Service arbeiten
  @Output() openChannel = new EventEmitter<void>();
  @Output() openPrivateChat = new EventEmitter<void>();
  @Output() openNewChat = new EventEmitter<void>();
  private subscription: Subscription | undefined;
  constructor(public dialog: MatDialog, public usersService: UserService, public channelService: ChannelService, public chatService: ChatService) {}
  ngOnInit() {
    const subscription = this.chatService.subChats().subscribe(messages => {
      messages.forEach((message: any) => {
        this.chatService.getMessageUsernames(message).then(usernames => {
          console.log(usernames);
          const username = usernames[0]; // Nehmen Sie das erste Element aus dem Array von Benutzernamen
          this.messagesWithUsernames.push({ message, username });
        });
      });
    });
  }

  ngOnDestroy() {
    // Beenden Sie das Abonnement, um Speicherlecks zu vermeiden
    this.subscription?.unsubscribe();
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

  onOpenChannel(i:number) {
    this.channelService.selectedChannel = i;
    this.openChannel.emit();
  }
  // So muss die Funktion mit Parameter aussehen!
  //   onOpenChannel(index:number) {
  //   this.openChannel.emit(index);
  // }

  onOpenPrivateChat(i:number) {
    this.usersService.selectedUser = i;
    console.log('index is', i);
    this.openPrivateChat.emit();
  }


  /**
   * Opens AddChannelDialog by click
   */
  openAddChannelDialog() {
    this.dialog.open(DialogAddChannelComponent, {panelClass: 'dialog-bor-rad-round'});
  }
}
