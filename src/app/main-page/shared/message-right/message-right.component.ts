import { Component, Input, ViewChild } from '@angular/core';
import { EventService } from '../../../services/event.service';
import { MatDialog } from '@angular/material/dialog';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogShowProfilComponent } from '../../dialogs/dialog-show-profil/dialog-show-profil.component';
import { ChannelService } from '../../../services/channel.service';
import { UserService } from '../../../services/user.service';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import {MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { EmojiComponent, EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { Message } from '../../../models/message.class';
import { AuthService } from '../../../services/auth.service';
import { Reaction } from '../../../models/reaction.class';

@Component({
  selector: 'app-message-right',
  standalone: true,
  imports: [MatDialogModule, PickerComponent, MatMenuModule, EmojiComponent],
  templateUrl: './message-right.component.html',
  styleUrl: './message-right.component.scss'
})
export class MessageRightComponent {

  @Input() onChannelBoard: boolean = false;
  @Input() messageIndex: number = 0;
  @Input() member: string = '';
  @Input() message: string = '';
  @Input() memberImg: string = '';
  @Input() amountMessage: number = 0;
  @Input() time: string = '';
  @Input() timeLastMessage: string = '';
  @Input() selectedChatIndex: number = 0;
  @Input() memberRef: string = '';
  @ViewChild('aboveMenuTrigger') emojiMenuTrigger?: MatMenuTrigger;

  containerHovered: boolean = false;
  messageObj: Message;

  constructor(private evtSvc: EventService, public dialog: MatDialog, private channelService: ChannelService, private userService: UserService, private authService: AuthService) {
    this.messageObj = Object.assign({}, this.channelService.selectedChannelChats[this.channelService.selChatIndex].allMessages[this.messageIndex]);
  }

  onMouseOver(action:string) {
    if (this.emojiMenuTrigger && this.emojiMenuTrigger.menuOpen) {
    } else {
      if(action === 'enter') {
        this.containerHovered = true;
      } else if(action === 'leave') {
        this.containerHovered = false;
      }
    }
  }


  onOpenThread(chatIndex:number) {
    this.channelService.selChatIndex = chatIndex;
    this.evtSvc.openThread();
  }


  openShowProfilDialog() {
    let memberData = this.userService.users[this.userService.getUsersData(this.memberRef)];

    this.dialog.open(DialogShowProfilComponent, {panelClass: 'dialog-bor-rad-round', data: {
        profilName: memberData.name,
        profilRef: memberData.id,
        profilEmail: memberData.email,
        profilImg: memberData.photoURL,
      }});
  }


  addEmoji($event: EmojiEvent) {
    console.log("Emoji klappt schon mal", $event.emoji);

    if($event.emoji && $event.emoji.colons && this.authService.uid) {

      let newReaction: Reaction = {
        reactUser: this.authService.uid, 
        reactEmoji: $event.emoji.colons
      }
  
      this.messageObj.reactions.push(newReaction);
  
      // checken ob ich mit dem emoji schon drin bin, wenn ja, dann rauslöschen, wenn nein, dann pushen und am ende alles updaten. 
  
      this.channelService.updateMessage(this.messageObj);

    }
  }
}

// onMouseOver() evtl auf parent componente legen