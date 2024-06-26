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
import { NgClass, NgIf } from '@angular/common';


@Component({
  selector: 'app-dialog-add-channel',
  standalone: true,
  imports: [FormsModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, SearchMemberInputComponent, NgClass, NgIf],
  templateUrl: './dialog-add-channel.component.html',
  styleUrl: './dialog-add-channel.component.scss'
})
export class DialogAddChannelComponent {

  @ViewChild(SearchMemberInputComponent) searchMembersComponent?: SearchMemberInputComponent;

  channel: Channel = new Channel();
  addMembersOpen = false;
  selectMerbersOpen = false;
  channelNameTaken = false;


  constructor(private channelService: ChannelService, private userService: UserService, private authService: AuthService, private evSc: EventService) { }


  /**
   * Sets addMembersOpen variable
   * 
   * @returns - boolean
   */
  async openAddMembers() {
    if (await this.channelService.isChannelNameTaken(this.channel.name)) {
      this.channelNameTaken = true;
      return;
    } else {
      this.channelNameTaken = false;
      this.addMembersOpen = true;
    }
  }


  /**
   * Sets selectMerbersOpen variable
   * 
   * @param checked - boolean
   */
  toggleInput(checked: boolean) {
    this.selectMerbersOpen = checked;
  }


  /**
   * Saves new channel and opens it
   */
  async saveChannel() {
    this.setMembers();
    this.channel.creator = this.authService.uid;
    await this.channelService.addChannel(this.channelService.toJSON(this.channel), 'channels');
    if (this.channelService.newAddedChannelRef !== "") {
      this.channelService.unsubSglChannelChats();
      this.channelService.subSglChannelChats(this.channelService.newAddedChannelRef);
      this.evSc.ChannelModus();
      this.channelService.setSelectedChannelIndex(this.channelService.newAddedChannelRef);
    }
  }


  /**
   * Sets members for new channel
   */
  setMembers() {
    let allMembers = <HTMLInputElement>document.getElementById('all-members');
    let selectedMembers = <HTMLInputElement>document.getElementById('selected-members');
    let selectedMembersArray = this.searchMembersComponent?.selectedMembers;
    this.channel.members = [];
    if (allMembers && allMembers.checked == true) {
      const searchId = 'QYPtvwBXDrriklmXFZIb';
      const index = this.channelService.allChannels.findIndex(user => user.id === searchId);

      if(index >= 0) {
        for (let i = 0; i < this.channelService.allChannels[index].members.length; i++) {
          const member = this.channelService.allChannels[index].members[i];
          this.channel.members?.push(member);
        }
        this.channel.members.push(this.authService.uid);
      }
    } else if (selectedMembers && selectedMembers.checked == true) {
      if (selectedMembersArray) {
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
