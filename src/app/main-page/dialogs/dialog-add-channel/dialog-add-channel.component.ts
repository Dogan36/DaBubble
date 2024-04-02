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
import { Channel } from '../../../models/channel.class';
import { ChannelService } from '../../../services/channel.service';


@Component({
  selector: 'app-dialog-add-channel',
  standalone: true,
  imports: [FormsModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose],
  templateUrl: './dialog-add-channel.component.html',
  styleUrl: './dialog-add-channel.component.scss'
})
export class DialogAddChannelComponent {

  channel: Channel = new Channel();
  addMembersOpen = false;
  selectMerbersOpen = false;


  constructor(private channelService: ChannelService){}

  openAddMembers() {
    this.addMembersOpen = true;
  }


  toggleInput(checked: boolean) {
    this.selectMerbersOpen = checked;
    console.log('selectMemberOpen is ', this.selectMerbersOpen)
  }

  saveChannel() {
    this.channel.members = ['regina'];
    console.log('Current channel is', this.channel);

    this.channelService.addChannel(this.channelService.toJSON(this.channel), 'channels');
  }
}
