import { Component, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextareaMainPageComponent } from '../shared/textarea-main-page/textarea-main-page.component';
import { MessageLeftComponent } from '../shared/message-left/message-left.component';
import { MessageRightComponent } from '../shared/message-right/message-right.component';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogEditChannelComponent } from '../dialogs/dialog-edit-channel/dialog-edit-channel.component';
import { ChannelService } from '../../services/channel.service';
import { WorkspaceUserProfilComponent } from '../shared/workspace-user-profil/workspace-user-profil.component';
import { UserService } from '../../services/user.service';
import { SearchMemberInputComponent } from '../shared/search-member-input/search-member-input.component';
import { Channel } from '../../models/channel.class';
import { User } from '../../models/user.class';
import { AuthService } from '../../services/auth.service';
import { TimeSeparatorComponent } from '../shared/time-separator/time-separator.component';

@Component({
  selector: 'app-channel-board',
  standalone: true,
  imports: [TextareaMainPageComponent, MessageLeftComponent, MessageRightComponent, MatDialogModule, CommonModule, WorkspaceUserProfilComponent, SearchMemberInputComponent, TimeSeparatorComponent],
  templateUrl: './channel-board.component.html',
  styleUrl: './channel-board.component.scss'
})
export class ChannelBoardComponent {

  @ViewChild(SearchMemberInputComponent) searchMembersComponent?: SearchMemberInputComponent;
  @ViewChild('channelChatsContainer') channelChatsContainerRef?: ElementRef;

  channelBoard = true;
  private bodyClickListener?: () => void;
  channelData = this.channelService.channels[this.channelService.selectedChannel];
  chatsData = this.channelService.selectedChannelChats;
  textfieldOnUpload = false;


  constructor(public dialog: MatDialog, public channelService: ChannelService, private renderer: Renderer2, public userService: UserService, public authService: AuthService) { }


  /**
   * Opens dialog window on click
   */
  openEditChannelDialog() {
    this.dialog.open(DialogEditChannelComponent, { panelClass: 'dialog-bor-rad-round' });
  }


  /**
   * Opens dialog window (modal) on click. 
   * 
   * @param selDialog - string, shows which dialog was choosen
   */
  openChannelMembersDialog(selDialog: string) {
    let dialog = <HTMLDialogElement>document.getElementById(selDialog);
    if (dialog) {
      let wrapper = document.getElementById("dialog-wrapper");
      if (wrapper) {
        dialog.style.left = (wrapper.offsetLeft + wrapper.offsetWidth - dialog.offsetWidth - 512) + "px";
        dialog.style.top = (wrapper.offsetTop + wrapper.offsetHeight + 140) + "px";
        dialog.showModal();
        if (window.innerWidth > 544 && window.innerWidth <= 792) {
          dialog.style.top = (wrapper.offsetTop + wrapper.offsetHeight + 88) + "px";
        }
        if (window.innerWidth <= 544) {
          dialog.style.left = ((window.innerWidth - dialog.offsetWidth) / 2) + "px";
        }
      }
    }
    setTimeout(() => {
      this.closeDialogOnClickDok(dialog);
    }, 100);
  }


  /**
   * Help function - closes dialog when document was clicked
   * 
   * @param dialog - HTMLDialogElement
   */
  closeDialogOnClickDok(dialog: HTMLDialogElement) {
    this.bodyClickListener = this.renderer.listen(document.body, 'click', (event) => {
      const dialogDimensions = dialog.getBoundingClientRect()
      if (
        event.clientX < dialogDimensions.left ||
        event.clientX > dialogDimensions.right ||
        event.clientY < dialogDimensions.top ||
        event.clientY > dialogDimensions.bottom
      ) {
        dialog.close();
        if (this.bodyClickListener) {
          this.bodyClickListener();
        }
      }
    });
  }


  /**
   * Closes dialog on click
   * 
   * @param selDialog - string, shows which dialog was choosen
   */
  closeDialog(selDialog: string) {
    let dialog = <HTMLDialogElement>document.getElementById(selDialog);
    dialog.close();
    let selectedMembersArray = this.searchMembersComponent?.selectedMembers;

    if (selectedMembersArray && selectedMembersArray.length > 0 && this.searchMembersComponent) {
      this.searchMembersComponent.selectedMembers = [];
    }

    if (this.bodyClickListener) {
      this.bodyClickListener();
    }
  }


  /**
   * Adds selected members to channel members and closes dialog
   */
  addMembersToChannel() {
    let selectedMembersArray = this.searchMembersComponent?.selectedMembers;
    let channel = Object.assign({}, this.channelService.channels[this.channelService.selectedChannel]);
    if (selectedMembersArray) {
      for (let i = 0; i < selectedMembersArray.length; i++) {
        const selectedMember = selectedMembersArray[i];
        if (!this.checkIfUserIsAleadyAdded(selectedMember, channel))
          channel.members.push(selectedMember.id);
      }
      this.channelService.updateChannel(channel);
    }
    if (this.searchMembersComponent) {
      this.searchMembersComponent.selectedMembers = [];
    }
    this.closeDialog('dialog-add-members');
  }


  /**
   * Checks if user.id is already inside selected channel.members
   * 
   * @param userObj - Choosen user object
   * @param channel - selected channel object
   * @returns - boolean
   */
  checkIfUserIsAleadyAdded(userObj: User, channel: Channel) {
    if (channel.members.indexOf(userObj.id) >= 0) {
      return true
    } else {
      return false
    }
  }


  /**
   * Scrolls container depending on containerElement height
   */
  scrollToBottom(): void {
    if (this.channelChatsContainerRef) {
      const containerElement = this.channelChatsContainerRef.nativeElement;
      containerElement.scrollTop = containerElement.scrollHeight;
    }
  }

  
  /**
   * Sets if file upload is on this textfield
   * 
   * @param event - boolean
   */
  setTextfieldStatus(event: boolean) {
    this.textfieldOnUpload = event;
  }
}

