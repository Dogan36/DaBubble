import { Component } from '@angular/core';
import {
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { ChannelService } from '../../../services/channel.service';
import { Channel } from '../../../models/channel.class';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { EventService } from '../../../services/event.service';

@Component({
  selector: 'app-dialog-edit-channel',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogClose],
  templateUrl: './dialog-edit-channel.component.html',
  styleUrl: './dialog-edit-channel.component.scss'
})
export class DialogEditChannelComponent {

  editNameOpen = false;
  editTextOpen = false;
  public channelData = this.channelService.channels[this.channelService.selectedChannel];
  channel: Channel;

  constructor(public channelService: ChannelService, private authService: AuthService, public userService: UserService, private evSc: EventService) {
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


  saveChanges(field: string) {
    let changedName = <HTMLInputElement>document.getElementById('channelName');
    let changedText = <HTMLInputElement>document.getElementById('description');
    if (field == 'name') {
      this.channel.name = changedName.value;
    } else if (field == 'text') {
      this.channel.description = changedText.value;
    }
    this.channelService.updateChannel(this.channel);
  }

  leaveChannel() {
    if (this.authService.uid) {
      let index = this.channel.members?.indexOf(this.authService.uid);
      if (index !== -1) {
        this.channel.members?.splice(index, 1);
        this.channelService.updateChannel(this.channel);
        this.channelService.unsubSglChannelChats();
        this.channelService.selectedChannel = 0;
        let newSelChannel = this.channelService.channels[this.channelService.selectedChannel];
        this.channelService.subSglChannelChats(newSelChannel.id);
        this.evSc.ChannelModus();
      }
    }
  }
}
