import { Component, Input, ViewChild, Output,EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../services/event.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogShowProfilComponent } from '../../dialogs/dialog-show-profil/dialog-show-profil.component';
import { ChannelService } from '../../../services/channel.service';
import { UserService } from '../../../services/user.service';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { EmojiComponent, EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { Message } from '../../../models/message.class';
import { AuthService } from '../../../services/auth.service';
import { Reaction } from '../../../models/reaction.class';
import { ChatService } from '../../../services/chat.service';
import { FormatUrlsService } from '../../../services/format-urls.service';
import { SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'app-message-left',
  standalone: true,
  imports: [MatDialogModule, PickerComponent, MatMenuModule, EmojiComponent, CommonModule],
  templateUrl: './message-left.component.html',
  styleUrl: './message-left.component.scss'
})
export class MessageLeftComponent {

  @Input() onChannelBoard: boolean = false;
  @Input() onPrivateChat: boolean = false;
  @Input() onThreadBoard: boolean = false;
  @Input() messageIndex: number = 0;
  @Input() member: string = '';
  @Input() message: string = '';
  @Input() memberImg: string = '';
  @Input() amountMessage: number = 0;
  @Input() time: string = '';
  @Input() timeLastMessage: string = '';
  @Input() selectedChatIndex: number = 0;
  @Input() memberRef: string = '';
  @Input() sortedReactions: {reactUser: string[], reactEmoji: string}[] = [];
  @Input() uploadedFile: string[] = [];
  sanitizedMessage: SafeHtml | undefined;
  @Output() messageLoaded: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('aboveMenuTrigger') emojiMenuTrigger?: MatMenuTrigger;

  containerHovered: boolean = false;


  constructor(private evtSvc: EventService, public dialog: MatDialog, private channelService: ChannelService, public userService: UserService, public authService: AuthService, private chatService: ChatService, public urlService: FormatUrlsService) {}

  ngOnInit() {
    this.sanitizedMessage = this.urlService.formatUrls(this.message);
  }
  /**
   * Signals parent element that message was loaded and triggers an event
   */
  ngAfterViewInit(): void {
    this.messageLoaded.emit();
  }


  /**
   * Sets containerHovered varibale and shows or hides hovered info container
   * 
   * @param action - string, to display which event was triggered
   */
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


  /**
   * Opens thread window on click
   */
  onOpenThread() {
    if(this.onChannelBoard === true) {
      this.evtSvc.openThread(true);
      if (window.innerWidth <= 1440) { 
        this.evtSvc.openChannel(false);
      }
    }
  }


  /**
   * Sets selChatIndex variabel in channelService. 
   * 
   * @param chatIndex - Index of selected chat, which is the input variabel 'selectedChatIndex' and given down by parent element
   */
  setChatIndex(chatIndex:number) {
    if(this.onChannelBoard === true) {
      this.channelService.selChatIndex = chatIndex;
    }
  }


  /**
   * Opens dialog window
   */
  openShowProfilDialog() {
    let memberData = this.userService.users[this.userService.getUsersData(this.memberRef)];   
    this.dialog.open(DialogShowProfilComponent, {panelClass: ['dialog-bor-rad-round', 'user-profil-popup'], data: {
        profilName: memberData.name,
        profilRef: memberData.id,
        profilEmail: memberData.email,
        profilImg: memberData.photoURL,
      }});
  }


  /**
   * Adds emoji to message by creating a Reaction object and checks if reaction exists already by user. Than updates message
   * 
   * @param $event 
   */
  addEmoji($event: EmojiEvent) {
    if($event.emoji && $event.emoji.colons && this.authService.uid) {
    let messageObj;
    if(this.onPrivateChat === false) {
      messageObj = Object.assign({}, this.channelService.selectedChannelChats[this.channelService.selChatIndex].allMessages[this.messageIndex]);
    } else {
      messageObj = this.chatService.messages[this.messageIndex];
    }

      let newReaction: Reaction = {
        reactUser: this.authService.uid, 
        reactEmoji: $event.emoji.colons
      }

      const index = messageObj.reactions.findIndex(reaction =>
        reaction.reactUser === newReaction.reactUser && reaction.reactEmoji === newReaction.reactEmoji
      );

      if(index === -1) {
        messageObj.reactions.push(newReaction);
        if(this.onPrivateChat === false) {
          this.channelService.updateMessage(messageObj);
        } else {
          this.chatService.updateMessage(messageObj);
        }
      }
    }
  }


  /**
   * Adds or removes emoji to message by creating a Reaction object and checks if reaction exists already by user. Than updates message
   * 
   * @param reactEmoji - string, clicked emoji name under message
   */
  addOrRemoveEmoji(reactEmoji: string) {
    let messageObj; 
    if(this.onPrivateChat === false) {
      messageObj = Object.assign({}, this.channelService.selectedChannelChats[this.channelService.selChatIndex].allMessages[this.messageIndex]);
    } else {
      messageObj = this.chatService.messages[this.messageIndex];
    }

    let newReaction: Reaction = {
        reactUser: this.authService.uid, 
        reactEmoji: reactEmoji
      }

    const index = messageObj.reactions.findIndex(reaction =>
        reaction.reactUser === newReaction.reactUser && reaction.reactEmoji === newReaction.reactEmoji
      );

    if(index === -1) {
        messageObj.reactions.push(newReaction);
        if(this.onPrivateChat === false) {
          this.channelService.updateMessage(messageObj);
        } else {
          this.chatService.updateMessage(messageObj);
        }
    } else {
        messageObj.reactions.splice(index, 1);
        if(this.onPrivateChat === false) {
          this.channelService.updateMessage(messageObj);
        } else {
          this.chatService.updateMessage(messageObj);
        }
    }
  }
}
