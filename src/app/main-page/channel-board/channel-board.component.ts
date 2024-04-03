import { Component, Output, EventEmitter } from '@angular/core';
import { TextareaMainPageComponent } from '../shared/textarea-main-page/textarea-main-page.component';
import { MessageLeftComponent } from '../shared/message-left/message-left.component';
import { MessageRightComponent } from '../shared/message-right/message-right.component';
import { MatDialog } from '@angular/material/dialog';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogEditChannelComponent } from '../dialogs/dialog-edit-channel/dialog-edit-channel.component';
import { ChannelService } from '../../services/channel.service';


@Component({
  selector: 'app-channel-board',
  standalone: true,
  imports: [TextareaMainPageComponent, MessageLeftComponent, MessageRightComponent, MatDialogModule],
  templateUrl: './channel-board.component.html',
  styleUrl: './channel-board.component.scss'
})
export class ChannelBoardComponent {

    channelBoard = true;

    constructor(public dialog: MatDialog, public channelService: ChannelService) {
      
    }


    openEditChannelDialog() {
      this.dialog.open(DialogEditChannelComponent, {panelClass: 'dialog-bor-rad-round'});
    }
}
