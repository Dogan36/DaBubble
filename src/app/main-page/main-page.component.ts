import { Component, inject } from '@angular/core';
import { WorkspaceMenuComponent } from './workspace-menu/workspace-menu.component';
import { ChatBoardComponent } from './chat-board/chat-board.component';
import { ChannelBoardComponent } from './channel-board/channel-board.component';
import { ThreadBoardComponent } from './thread-board/thread-board.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [WorkspaceMenuComponent, ChatBoardComponent, ThreadBoardComponent, MatSidenavModule, MatButtonModule, ChannelBoardComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {
  authService: AuthService = inject(AuthService);
  workspaceOpen = true;
  privateChatOpen = true;
  threadOpen = true;


  closeThread() {
    this.threadOpen = false;
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


  openChanel() {
    this.privateChatOpen = false;
  }
  // Es muss noch ein Index als Parameter mitgesehndet werden
  //   openChanel(i) {
  //   this.channelChatOpen = true;
  //   this.privateChatOpen = false;

      // Aus channelList = []; wird mithilfe des index, der richtig Channel ausgesucht, evtl in ein weiteres Array gepackt und diese Daten werden dann von dem Child ChannelBoardComponente abgegriffen/ gesendet.
  // }

  openPrivateChat() {
      this.privateChatOpen = true;
  }
}
