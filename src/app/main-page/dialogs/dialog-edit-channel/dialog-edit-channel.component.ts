import { Component } from '@angular/core';
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
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';


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
  channelData = this.channelService.channels[this.channelService.selectedChannel];
  channel: Channel;

  constructor(public channelService: ChannelService, private authService: AuthService, public userService: UserService ) {
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
  
  saveChanges(field:string) {
    let changedName = <HTMLInputElement>document.getElementById('channelName');
    let changedText = <HTMLInputElement>document.getElementById('description');

    
    if(field == 'name') {
      this.channel.name = changedName.value;
    } else if(field == 'text') {
      this.channel.description = changedText.value;
    }
    
    this.channelService.updateChannel(this.channel);
  }

  leaveChannel() {
    // evtl. Zugriff auf user id verbessern
    if(this.authService.uid) {
      let index = this.channel.members?.indexOf(this.authService.uid)
      
      if(index) {
        this.channel.members?.splice(index, 1);
        this.channelService.updateChannel(this.channel);
      }
    }
  }
}
