import { Component } from '@angular/core';
import { TextareaMainPageComponent } from '../shared/textarea-main-page/textarea-main-page.component';

@Component({
  selector: 'app-new-msg-board',
  standalone: true,
  imports: [TextareaMainPageComponent],
  templateUrl: './new-msg-board.component.html',
  styleUrl: './new-msg-board.component.scss'
})
export class NewMsgBoardComponent {

}
