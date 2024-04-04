import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { ChannelService } from '../../../services/channel.service';
import { Channel } from '../../../models/channel.class';


@Component({
  selector: 'app-dialog-edit-channel',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, FormsModule],
  templateUrl: './dialog-edit-channel.component.html',
  styleUrl: './dialog-edit-channel.component.scss'
})
export class DialogEditChannelComponent {

  editNameOpen = false;
  editTextOpen = false;
  // channel = this.channelService.channels.slice(this.channelService.selectedChannel);
  channel: Channel;
  // oldObj = this.channelService.channels[this.channelService.selectedChannel];

  constructor(public channelService: ChannelService) {
    // this.channel.creator = this.oldObj.creator;
    // this.channel.description = this.oldObj.description;
    // this.channel.id = this.oldObj.id;
    // this.channel.members = this.oldObj.members;
    // this.channel.name = this.oldObj.name;
    // this.channel.threads = this.oldObj.threads;
    // this.channel = this.channelService.channels.slice(this.channelService.selectedChannel);
    this.channel = Object.assign({}, this.channelService.channels[this.channelService.selectedChannel]);
  }

  openChangesName() {
    this.editNameOpen = true;
  }
  openChangesText() {
    this.editTextOpen = true;
  }

  closeChanges() {
    this.editNameOpen = false;
    this.editTextOpen = false;
  }
  
  saveChanges() {
    this.channelService.updateChannel(this.channel);
  }
}
