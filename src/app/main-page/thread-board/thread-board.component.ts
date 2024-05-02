import { Component, Output, EventEmitter } from '@angular/core';
import { TextareaMainPageComponent } from '../shared/textarea-main-page/textarea-main-page.component';
import { MessageLeftComponent } from '../shared/message-left/message-left.component';
import { MessageRightComponent } from '../shared/message-right/message-right.component';
import { EventService } from '../../services/event.service';
import { ChannelService } from '../../services/channel.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { TimeSeparatorComponent } from '../shared/time-separator/time-separator.component';

@Component({
  selector: 'app-thread-board',
  standalone: true,
  imports: [TextareaMainPageComponent, MessageLeftComponent, MessageRightComponent, TimeSeparatorComponent],
  templateUrl: './thread-board.component.html',
  styleUrl: './thread-board.component.scss'
})
export class ThreadBoardComponent {

  threadBoard = true;

  constructor(private evtSvc: EventService, public channelService: ChannelService, public userService: UserService, public authService: AuthService) {}

  onCloseThread() {
    this.evtSvc.openThread(false);

    if (window.innerWidth <= 544) {
      this.evtSvc.openChannel(false);
      this.evtSvc.openPrivateChat(false);
      this.evtSvc.openNewChat(false);
      this.evtSvc.openWorkspace(true);
    }
  }

}
