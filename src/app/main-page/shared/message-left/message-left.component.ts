import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ChannelBoardComponent } from '../../channel-board/channel-board.component';
import { EventService } from '../../../services/event.service';
import { MatDialog } from '@angular/material/dialog';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogShowProfilComponent } from '../../dialogs/dialog-show-profil/dialog-show-profil.component';
import { Chat } from '../../../models/chat.class';
import { ChannelService } from '../../../services/channel.service';

@Component({
  selector: 'app-message-left',
  standalone: true,
  imports: [ChannelBoardComponent, MatDialogModule],
  templateUrl: './message-left.component.html',
  styleUrl: './message-left.component.scss'
})
export class MessageLeftComponent {

  @Input() onChannelBoard: boolean = false;
  @Input() member: string = '';
  @Input() message: string = '';
  @Input() amountMessage: number = 0;
  // @Input() time: string = '';
  // @Input() timeLastMessage: string = '';
  @Input() selectedChatIndex: number = 0;

  containerHovered: boolean = false;


  constructor(private evtSvc: EventService, public dialog: MatDialog, private channelService: ChannelService) {}


  onMouseOver() {
    this.containerHovered = !this.containerHovered;
  }


  onOpenThread(chatIndex:number) {
    this.channelService.selChatIndex = chatIndex;
    this.evtSvc.openThread();
  }


  openShowProfilDialog() {
    this.dialog.open(DialogShowProfilComponent, {panelClass: 'dialog-bor-rad-round'});
  }
}

// onMouseOver() evtl auf parent componente legen