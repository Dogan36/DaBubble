import { Component } from '@angular/core';
import { InputFilterPipe } from '../../../pipes/input-filter.pipe';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { WorkspaceUserProfilComponent } from '../workspace-user-profil/workspace-user-profil.component';
import { ChannelService } from '../../../services/channel.service';
import { User } from '../../../models/user.class';
import { EventService } from '../../../services/event.service';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [InputFilterPipe, FormsModule, WorkspaceUserProfilComponent],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss'
})
export class SearchInputComponent {

  inputText = '';
  searchText = '';
  searchChannel = false;
  searchUser = false;


  constructor(public userService: UserService, public channelService: ChannelService, private evtSvc: EventService) {}


  /**
   * Sets searchChannel or searchUser variable and searchText varibale, which will than show all matching resluts due to the pipe in the for loop
   */
  startSearch() {
    if (this.inputText.includes('@')) {
      this.searchText = this.inputText.replace('@', '');
      this.searchUser = true;
    } else if (this.inputText.includes('#')) {
      this.searchText = this.inputText.replace('#', '');
      this.searchChannel = true;
    } else {
        this.searchChannel = false;
        this.searchUser = false;
    }
  }


  /**
   * Opens channel borad and subscribes the right channel
   * 
   * @param channelRef - channel Id
   */
  onOpenChannel(channelRef:string) {
    this.channelService.unsubSglChannelChats();
    this.channelService.subSglChannelChats(channelRef);
    this.channelService.setSelectedChannelIndex(channelRef);
    this.evtSvc.ChannelModus();
  }


  /**
   * Sets searchText and inputText variabel to ''. 'searched-users-list-container' div will noch be displayed
   */
  stopSearch() {
    this.searchText = '';
    this.inputText = '';
  }
}
