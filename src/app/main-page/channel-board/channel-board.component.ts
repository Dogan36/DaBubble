import { Component } from '@angular/core';
import { TextareaMainPageComponent } from '../shared/textarea-main-page/textarea-main-page.component';
import { MessageLeftComponent } from '../shared/message-left/message-left.component';
import { MessageRightComponent } from '../shared/message-right/message-right.component';


@Component({
  selector: 'app-channel-board',
  standalone: true,
  imports: [TextareaMainPageComponent, MessageLeftComponent, MessageRightComponent],
  templateUrl: './channel-board.component.html',
  styleUrl: './channel-board.component.scss'
})
export class ChannelBoardComponent {

}
