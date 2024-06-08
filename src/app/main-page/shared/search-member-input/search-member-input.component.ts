import { Component, Input } from '@angular/core';
import { InputFilterPipe } from '../../../pipes/input-filter.pipe';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { WorkspaceUserProfilComponent } from '../workspace-user-profil/workspace-user-profil.component';
import { ChannelService } from '../../../services/channel.service';
import { User } from '../../../models/user.class';

@Component({
  selector: 'app-search-member-input',
  standalone: true,
  imports: [InputFilterPipe, FormsModule, CommonModule, WorkspaceUserProfilComponent],
  templateUrl: './search-member-input.component.html',
  styleUrl: './search-member-input.component.scss'
})
export class SearchMemberInputComponent {

  searchText = '';
  selectedMembers: User[] = [];
  userIsAlreadyAdded = false;
  userIsAlreadyMember = false;

  @Input() onCreateNewChannel: boolean = false;

  constructor(public userService: UserService, public channelService: ChannelService) {}

  addUserAsMember(userObj: User) {
    if(!this.checkIfUserIsAleadyMember(userObj)) {
      if(!this.checkIfUserIsAleadyAdded(userObj)) {
        this.selectedMembers.push(userObj);
      } else {
        this.userIsAlreadyAdded = true;
      }
    } else {
      this.userIsAlreadyMember = true;
    }
    let inputFiled = document.getElementById('search-user-input') as HTMLInputElement;
    if(inputFiled) {
      inputFiled.value = '';
    }
    this.searchText = '';

    setTimeout(() => {
      this.userIsAlreadyAdded = false;
      this.userIsAlreadyMember = false;
    }, 2000);
  }

  getUserData(userName:string) {
    let index = this.userService.users.findIndex(obj => obj.name === userName);
    return index
  }

  removeUser(i:number) {
    this.selectedMembers.splice(i, 1);
  }

  checkIfUserIsAleadyAdded(userObj:User) {
    if(this.selectedMembers.findIndex(obj => obj.id === userObj.id) >= 0) {
      return true
    } else {
      return false
    }
  }

  checkIfUserIsAleadyMember(userObj:User) {
    if(this.onCreateNewChannel) {
      return false;
    } else {
      let channel = this.channelService.channels[this.channelService.selectedChannel];
      if(channel.members.indexOf(userObj.id) >= 0) {
        return true
      } else {
        return false
      }
    }
  }
}
