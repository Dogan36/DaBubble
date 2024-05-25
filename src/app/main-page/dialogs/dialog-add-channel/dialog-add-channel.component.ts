import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
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
import { EventService } from '../../../services/event.service';


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


  constructor(private channelService: ChannelService, private userService: UserService, private authService: AuthService, private evSc: EventService){}

  openAddMembers() {
    this.addMembersOpen = true;
  }


  toggleInput(checked: boolean) {
    this.selectMerbersOpen = checked;
  }

  async saveChannel() {
    this.setMembers();
    this.channel.creator = this.authService.uid;

    await this.channelService.addChannel(this.channelService.toJSON(this.channel), 'channels');

    if(this.channelService.newAddedChannelRef !== "") {
      this.channelService.unsubSglChannelChats();
      this.channelService.subSglChannelChats(this.channelService.newAddedChannelRef);
      this.evSc.ChannelModus();
      this.channelService.setSelectedChannelIndex(this.channelService.newAddedChannelRef);
    }
  }


  setMembers() {
    let allMembers = <HTMLInputElement>document.getElementById('all-members');
    let selectedMembers = <HTMLInputElement>document.getElementById('selected-members');
    let selectedMembersArray = this.searchMembersComponent?.selectedMembers;
    this.channel.members = [];

    if(allMembers && allMembers.checked == true) {
      for (let i = 0; i < this.userService.users.length; i++) {
        const user = this.userService.users[i];

        if(user.name !== "Guest") {
          this.channel.members?.push(user.id);
        }
      }} else if(selectedMembers && selectedMembers.checked == true) {
        if(selectedMembersArray) {
          for (let i = 0; i < selectedMembersArray.length; i++) {
            const selectedMember = selectedMembersArray[i];
            this.channel.members.push(selectedMember.id);
          }
          this.channel.members.push(this.authService.uid);
          selectedMembersArray = [];
        } else {
            this.channel.members = [this.authService.uid];
        }
      } 
  }


  
}
