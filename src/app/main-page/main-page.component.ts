import { Component, inject } from '@angular/core';
import { WorkspaceMenuComponent } from './workspace-menu/workspace-menu.component';
import { ChatBoardComponent } from './chat-board/chat-board.component';
import { ChannelBoardComponent } from './channel-board/channel-board.component';
import { ThreadBoardComponent } from './thread-board/thread-board.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth.service';
import { EventService } from '../services/event.service';
import { NewMsgBoardComponent } from './new-msg-board/new-msg-board.component';


@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [WorkspaceMenuComponent, ChatBoardComponent, ThreadBoardComponent, MatSidenavModule, MatButtonModule, ChannelBoardComponent, NewMsgBoardComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {

  authService: AuthService = inject(AuthService);
  workspaceOpen = true;
  channelChatOpen = true;
  privateChatOpen = false;
  threadOpen = true;


  constructor(private evtSvc: EventService) {
    this.evtSvc.getThreadOpenStatus().subscribe(status => {
      this.threadOpen = status;
    });
  }

  ngOnInit() {
    console.log(this.authService.currentUser?.uid)
  }


  test() {
    console.log(this.authService.currentUser?.uid)
  }


  toggleSideNav() {
    this.workspaceOpen = !this.workspaceOpen;
  }


  // Es muss noch ein Index als Parameter mitgesehndet werden
  //   openChanel(i) {
  //   this.channelChatOpen = true;
  //   this.privateChatOpen = false;

      // Aus channelList = []; wird mithilfe des index, der richtig Channel ausgesucht, evtl in ein weiteres Array gepackt und diese Daten werden dann von dem Child ChannelBoardComponente abgegriffen/ gesendet.
  // }
  openNewChat() {
    this.channelChatOpen = false;
    this.privateChatOpen = false;
  }

  openChanel() {
    this.channelChatOpen = true;
    this.privateChatOpen = false;
  }

  openPrivateChat() {
      this.channelChatOpen = false;
      this.privateChatOpen = true;
  }
}
