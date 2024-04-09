import { Component } from '@angular/core';
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
  searchedUsers = this.userService.usersName;
  selectedMembers: User[] = [];

  constructor(public userService: UserService, public channelService: ChannelService) {}

  addUserAsMember(user:string) {
    let userObj = this.userService.users[this.getUserData(user)];

    if(!this.checkIfUserIsAleadyAdded(userObj)) {
      this.selectedMembers.push(userObj);
    }

    // Update Funktion! Aber nicht hier!
    // this.channelService.channels[this.channelService.selectedChannel].members?.push(id);
    // this.channelService.updateChannel(this.channelService.channels[this.channelService.selectedChannel]);
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


  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['searchText']) {
  //     this.openDialog();
  //   }
  //   console.log('funktioniert auch schon mal')
  //   // if (changes['searchText'] && changes['searchText'].currentValue && changes['searchText'].currentValue.trim() !== '') {
  //   //   this.openDialog();
  //   //   console.log('funktioniert auch schon mal')
  //   // }
  // }

  // ngDoCheck(): void {
  //   if (this.searchText && this.searchText.trim() !== '') {
  //     this.openDialog();
  //     console.log('Jap')
  //   }
  // }

  // openDialog() {
  //   let dialog = <HTMLDialogElement>document.getElementById('searched-user-dialog');

  //   dialog.show();
  //   console.log('function works');
  // }

}
