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
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogUserMenuComponent } from './dialogs/dialog-user-menu/dialog-user-menu.component';
import { UserType } from '../types/user.class';
import { ChannelService } from '../services/channel.service';
import { SearchService } from '../services/search.service';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, NgStyle } from '@angular/common';
import { WorkspaceUserProfilComponent } from './shared/workspace-user-profil/workspace-user-profil.component';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [NgIf, NgFor, NgStyle,FormsModule, WorkspaceMenuComponent, ChatBoardComponent, ThreadBoardComponent, MatSidenavModule, MatButtonModule, ChannelBoardComponent, NewMsgBoardComponent, MatDialogModule, WorkspaceUserProfilComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {
  authService: AuthService = inject(AuthService);
  searchService: SearchService = inject(SearchService);
  workspaceOpen = true;
  channelChatOpen = true;
  privateChatOpen = false;
  threadOpen = true;
  newChatOpen = false;
  uid: string = ''
  currentUser: UserType | null = null;
  searchText: string = '';
  inputFocus: boolean = false;
  imageLoaded = false;

  constructor(public evtSvc: EventService, public dialog: MatDialog, public channelService: ChannelService) {
    this.evtSvc.getThreadOpenStatus().subscribe(status => {
      this.threadOpen = status;
    });
    this.evtSvc.getChannelOpenStatus().subscribe(status => {
      this.channelChatOpen = status;
    });
    this.evtSvc.getPrivateChatOpenStatus().subscribe(status => {
      this.privateChatOpen = status;
    });
    this.evtSvc.getNewChatOpenStatus().subscribe(status => {
      this.newChatOpen = status;
    });
    this.evtSvc.getWorkspaceOpenStatus().subscribe(status => {
      this.workspaceOpen = status;
    });
  }

  ngOnInit() {
    if (window.innerWidth > 792 && window.innerWidth <= 1440) {
      this.evtSvc.openChannel(true);
      this.evtSvc.openPrivateChat(false);
      this.evtSvc.openThread(false);
      this.evtSvc.openNewChat(false);
    }
    if (window.innerWidth <= 792) {
      this.evtSvc.openChannel(false);
      this.evtSvc.openPrivateChat(false);
      this.evtSvc.openThread(false);
      this.evtSvc.openNewChat(false);
    }
  }

  startSearch() {
    if (this.searchText && this.searchText.length >= 3) {
      this.searchService.startSearch(this.searchText);
    }
  }

  toggleSideNav() {
    this.workspaceOpen = !this.workspaceOpen;
  }

  openNewChat() {
    this.evtSvc.openChannel(false);
    this.evtSvc.openPrivateChat(false);
    this.evtSvc.openNewChat(true);
    this.evtSvc.openThread(false);

    if (window.innerWidth <= 792) {
      this.evtSvc.openWorkspace(false);
    }
  }

  openChanel() {
    this.evtSvc.openChannel(true);
    this.evtSvc.openPrivateChat(false);
    this.evtSvc.openNewChat(false);
  
    if (window.innerWidth <= 792) {
      this.evtSvc.openWorkspace(false);
      this.evtSvc.openThread(false);
    } else if(window.innerWidth > 792 && window.innerWidth <= 1440) {
      this.evtSvc.openThread(false);
    } else {
      this.evtSvc.openThread(true);
    }
  }

  openPrivateChat() {
    this.evtSvc.openChannel(false);
    this.evtSvc.openPrivateChat(true);
    this.evtSvc.openNewChat(false);
    this.evtSvc.openThread(false);
    if (window.innerWidth <= 792) {
      this.evtSvc.openWorkspace(false);
    }
  }

  openWorkspace() {
    if (window.innerWidth <= 792) {
      this.evtSvc.openChannel(false);
      this.evtSvc.openPrivateChat(false);
      this.evtSvc.openNewChat(false);
      this.evtSvc.openWorkspace(true);
      this.evtSvc.openThread(false);
    }
  }

  /**
   * Opens UserMenuDialog by click
   */
  openUserMenuDialog() {
    this.dialog.open(DialogUserMenuComponent, { position: { right: '24px', top: '80px' }, panelClass: ['dialog-bor-rad-corner', 'user-profil-menu'] });
  }

  stopSearch() {
    this.searchText = '';
  }

  onOpenChannel(channelRef:string) {
    this.channelService.unsubSglChannelChats();
    this.channelService.subSglChannelChats(channelRef);
    this.channelService.setSelectedChannelIndex(channelRef);
    this.evtSvc.ChannelModus();
  }

  openThreadOnSearch(channelRef:string, chatRef:string) {
    this.channelService.subSglChannelChats(channelRef, chatRef);
    this.channelService.setSelectedChannelIndex(channelRef);
  }

  setInputFocus(value: boolean) {
    this.inputFocus = value;
  }

  isInputFocused(): boolean {
    return this.inputFocus;
  }
}
