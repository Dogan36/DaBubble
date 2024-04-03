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
import { UserService } from '../../../services/user.service';


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


  constructor(private channelService: ChannelService, private userService: UserService){}

  openAddMembers() {
    this.addMembersOpen = true;
  }


  toggleInput(checked: boolean) {
    this.selectMerbersOpen = checked;
    console.log('selectMemberOpen is ', this.selectMerbersOpen)
  }

  saveChannel() {

    this.setMembers();
    console.log('Current channel is', this.channel);
    this.channel.creator = 'Regina';
    // Hier creator mit angemeldeten User austauschen!

    this.channelService.addChannel(this.channelService.toJSON(this.channel), 'channels');
  }


  setMembers() {
    let allMembers = <HTMLInputElement>document.getElementById('all-members');
    let selectedMembers = <HTMLInputElement>document.getElementById('selected-members');
    this.channel.members = [];

    if(allMembers && allMembers.checked == true) {
      for (let i = 0; i < this.userService.users.length; i++) {
        const user = this.userService.users[i];
        
        this.channel.members?.push(user.id);
      }} else if(selectedMembers && selectedMembers.checked == true) {
        this.channel.members = ['regina'];
      } 
  }
}
