import { Component, Input } from '@angular/core';
import { Message } from '../../../models/message.class';
import { FormsModule } from '@angular/forms';
import { ChannelService } from '../../../services/channel.service';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-textarea-main-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './textarea-main-page.component.html',
  styleUrl: './textarea-main-page.component.scss'
})
export class TextareaMainPageComponent {

  message: Message = new Message();

  @Input() onChannelBoard:boolean = false;
  @Input() onThreadBoard:boolean = false;
  // @Input() privatTextarea = false;

  constructor(private channelService: ChannelService, private authService: AuthService){}

  submitMessage() {
    // let messageField = <HTMLInputElement>document.getElementById('message-field');

    // if(messageField) {
      // messageField.value = '';

      this.message.member = this.authService.uid;
      this.message.timestamp = Date.now();

      if(this.onChannelBoard) {
        this.channelService.startNewChat({timestamp: this.message.timestamp}, this.channelService.toJSONmessage(this.message));

      } else if(this.onThreadBoard) {
        const selectedChat = this.channelService.selectedChannelChats[this.channelService.selChatIndex];
        if(selectedChat && selectedChat.chatId) {
        this.channelService.addMessageToChat(this.channelService.toJSONmessage(this.message), selectedChat.chatId);
      }}
      // else if(this.onPrivatChat) {

        // Hier kommt der Code für die PrivatChats hin! Vorher noch onPrivatChat im Chat Board definieren. 

      // }
    // }
    this.message.message = '';
  }


//   onEnterKeyPressed(event: Event) {
//   // Überprüfe, ob die gedrückte Taste die Enter-Taste ist
//   if ((event as KeyboardEvent).key === 'Enter' && (event as KeyboardEvent).shiftKey!) {
//     // Verhindere das Standardverhalten des Textfelds (Umbruch einer neuen Zeile)
//     event.preventDefault();

//     // Rufe deine submitMessage-Funktion auf
//     this.submitMessage();
//   }
// }
}
