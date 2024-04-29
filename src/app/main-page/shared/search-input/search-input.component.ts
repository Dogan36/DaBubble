import { Component } from '@angular/core';
import { InputFilterPipe } from '../../../pipes/input-filter.pipe';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { WorkspaceUserProfilComponent } from '../workspace-user-profil/workspace-user-profil.component';
import { ChannelService } from '../../../services/channel.service';
import { User } from '../../../models/user.class';

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

  constructor(public userService: UserService, public channelService: ChannelService) {}


  startSearch() {
    if (this.inputText.includes('@')) {

      console.log('Das "@" wurde gefunden.');
      this.searchText = this.inputText.replace('@', '');
      this.searchUser = true;

    } else if (this.inputText.includes('#')) {

      console.log('Das "#" wurde gefunden.');
      this.searchText = this.inputText.replace('#', '');
      this.searchChannel = true;

    } else {

        this.searchChannel = false;
        this.searchUser = false;

    }
  }


  onOpenChannel(channelRef:string) {
    // this.channelService.subSglChannelChats(channelRef);
    // this.channelService.selectedChannel = i; // index irgendwie vergeben. Vielleicht noch mal abgleichen mit der channels liste.
    // this.openChannel.emit();
  }


  openChat(user: User) {

  }

}
