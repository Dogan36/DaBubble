import { Component, ViewChild } from '@angular/core';
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
import { SearchMemberInputComponent } from '../../shared/search-member-input/search-member-input.component';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-dialog-add-channel',
  standalone: true,
  imports: [FormsModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, SearchMemberInputComponent],
  templateUrl: './dialog-add-channel.component.html',
  styleUrl: './dialog-add-channel.component.scss'
})
export class DialogAddChannelComponent {

  @ViewChild(SearchMemberInputComponent) searchMembersComponent?: SearchMemberInputComponent;

  channel: Channel = new Channel();
  addMembersOpen = false;
  selectMerbersOpen = false;


  constructor(private channelService: ChannelService, private userService: UserService, private authService: AuthService){}

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
    this.channel.creator = this.authService.uid;

    this.channelService.addChannel(this.channelService.toJSON(this.channel), 'channels');
  }


  setMembers() {
    let allMembers = <HTMLInputElement>document.getElementById('all-members');
    let selectedMembers = <HTMLInputElement>document.getElementById('selected-members');
    let selectedMembersArray = this.searchMembersComponent?.selectedMembers;
    this.channel.members = [];

    if(allMembers && allMembers.checked == true) {
      for (let i = 0; i < this.userService.users.length; i++) {
        const user = this.userService.users[i];
        
        this.channel.members?.push(user.id);
      }} else if(selectedMembers && selectedMembers.checked == true) {
        if(selectedMembersArray) {
          for (let i = 0; i < selectedMembersArray.length; i++) {
            const selectedMember = selectedMembersArray[i];
            this.channel.members.push(selectedMember.id);
          }
          selectedMembersArray = [];
        } else {
            this.channel.members = [this.authService.uid];
        }
      } 
  }
}
