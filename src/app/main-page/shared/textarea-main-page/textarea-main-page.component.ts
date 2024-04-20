import { Component } from '@angular/core';
import { Message } from '../../../models/message.class';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-textarea-main-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './textarea-main-page.component.html',
  styleUrl: './textarea-main-page.component.scss'
})
export class TextareaMainPageComponent {

  message: Message = new Message();


  sendMessage() {
    let messageField = <HTMLInputElement>document.getElementById('message-field');
    console.log('Klappt schon mal', this.message.message);

    if(messageField) {
      messageField.value = '';
    }
  }

}

