import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { EmojiComponent, EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { ChannelService } from '../../../services/channel.service';
import { Message } from '../../../models/message.class';
import { FormsModule, NgForm } from '@angular/forms';
import { ChatService } from '../../../services/chat.service';

@Component({
  selector: 'app-edit-msg-textarea',
  standalone: true,
  imports: [PickerComponent, MatMenuModule, EmojiComponent, EditMsgTextareaComponent, FormsModule],
  templateUrl: './edit-msg-textarea.component.html',
  styleUrl: './edit-msg-textarea.component.scss'
})
export class EditMsgTextareaComponent {
  @Input() messageIndex: number = 0;
  @Input() message: string = '';
  @Input() onChannelBoard: boolean = false;
  @Input() onPrivateChat: boolean = false;
  @Input() onThreadBoard: boolean = false;  
  @Input() uploadedFile: string[] = [];

  @Output() closeEditMsg = new EventEmitter<boolean>();

  constructor(public channelService: ChannelService, private chatService: ChatService) {}


  /**
   * Saves changes to a message and closes edit window
   * 
   * @param ngForm 
   */
  updateMessage(ngForm: NgForm) {
    let messageObj;
    if(this.onPrivateChat !== true) {
      messageObj = Object.assign({}, this.channelService.selectedChannelChats[this.channelService.selChatIndex].allMessages[this.messageIndex]);
    } else {
      messageObj = this.chatService.messages[this.messageIndex];
    }
    if (ngForm.valid && this.message.trim() !== '') {
      messageObj.message = this.message;
      messageObj.uploadedFile = this.uploadedFile;
      if(this.onPrivateChat !== true) {
        this.channelService.updateMessage(messageObj);
      } else {
        this.chatService.updateMessage(messageObj);
      }
      ngForm.resetForm();
      this.closeEditMsg.emit(false);
    } else {
        console.log('Ungültige Eingabe');
    }
  }


  /**
   * Signals parent element to close edit message window
   * 
   * @param event 
   */
  cancleUpdateMsg(event: Event) {
    event.preventDefault()
    this.closeEditMsg.emit(false);
  }


  /**
   * Adds selected emoji
   * 
   * @param $event 
   */
  addEmoji($event: EmojiEvent) {
    if($event.emoji.native)
    this.message += $event.emoji.native;
  }


/**
 * Sets uploadedFile to [] and deletes it within the message
 */
  deleteFile() {
    // mit der docRef file vom Storage löschen!
    this.uploadedFile = [];
  }
}
