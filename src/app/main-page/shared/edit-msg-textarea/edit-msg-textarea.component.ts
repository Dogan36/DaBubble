import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { EmojiComponent, EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { ChannelService } from '../../../services/channel.service';
import { Message } from '../../../models/message.class';
import { FormsModule, NgForm } from '@angular/forms';

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
  @Output() closeEditMsg = new EventEmitter<boolean>();


  constructor(public channelService: ChannelService) {}


  updateMessage(ngForm: NgForm) {

    const messageObj = Object.assign({}, this.channelService.selectedChannelChats[this.channelService.selChatIndex].allMessages[this.messageIndex]);

    if (ngForm.valid && this.message.trim() !== '') {
      messageObj.message = this.message;
      this.channelService.updateMessage(messageObj);

      ngForm.resetForm();
      this.closeEditMsg.emit(false);
    } else {
        console.log('Ungültige Eingabe');
    }
  }


  cancleUpdateMsg(event: Event) {
    event.preventDefault()

    this.closeEditMsg.emit(false);
  }

  addEmoji($event: EmojiEvent) {
    if($event.emoji.native)
    this.message += $event.emoji.native;
  }
}