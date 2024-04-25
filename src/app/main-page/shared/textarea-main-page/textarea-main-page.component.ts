import { Component, Input } from '@angular/core';
import { Message } from '../../../models/message.class';
import { FormsModule, NgForm } from '@angular/forms';
import { ChannelService } from '../../../services/channel.service';
import { AuthService } from '../../../services/auth.service';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import {MatMenuModule} from '@angular/material/menu';
import { EmojiComponent, EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';


@Component({
  selector: 'app-textarea-main-page',
  standalone: true,
  imports: [FormsModule, PickerComponent, MatMenuModule, EmojiComponent],
  templateUrl: './textarea-main-page.component.html',
  styleUrl: './textarea-main-page.component.scss'
})
export class TextareaMainPageComponent {

  message: Message = new Message();


  @Input() onChannelBoard:boolean = false;
  @Input() onThreadBoard:boolean = false;
  // @Input() privatTextarea = false;

  constructor(private channelService: ChannelService, private authService: AuthService){}

  submitMessage(ngForm: NgForm) {

      if (ngForm.valid && this.message.message.trim() !== '') { 
      this.message.member = this.authService.uid;
      this.message.timestamp = Date.now();

      if(this.onChannelBoard) {
        this.channelService.startNewChat({timestamp: this.message.timestamp}, this.channelService.toJSONmessage(this.message));
        console.log('Event hat geklappt', this.message.message);

      } else if(this.onThreadBoard) {
        const selectedChat = this.channelService.selectedChannelChats[this.channelService.selChatIndex];
        if(selectedChat && selectedChat.chatId) {
        this.channelService.addMessageToChat(this.channelService.toJSONmessage(this.message), selectedChat.chatId);
      }}
      // else if(this.onPrivatChat) {

        // Hier kommt der Code für die PrivatChats hin! Vorher noch onPrivatChat im Chat Board definieren. 

      // }
    // }
    ngForm.resetForm();
      } else {
        console.log('Ungültige Eingabe');
      }
  }


  onEnterKeyPressed(event: Event, ngForm: NgForm) {
    if (!(event as KeyboardEvent).shiftKey && (event as KeyboardEvent).key === 'Enter') {
    event.preventDefault();
      this.submitMessage(ngForm);
    }
  }


  addEmoji($event: EmojiEvent) {
      if($event.emoji.native)
      this.message.message += $event.emoji.native;
      }
  }
