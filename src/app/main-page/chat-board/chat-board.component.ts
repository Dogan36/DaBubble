import { Component } from '@angular/core';
import { TextareaMainPageComponent } from '../shared/textarea-main-page/textarea-main-page.component';

@Component({
  selector: 'app-chat-board',
  standalone: true,
  imports: [TextareaMainPageComponent],
  templateUrl: './chat-board.component.html',
  styleUrl: './chat-board.component.scss'
})
export class ChatBoardComponent {

}
