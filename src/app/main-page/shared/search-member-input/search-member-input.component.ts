import { Component } from '@angular/core';
import { InputFilterPipe } from '../../../pipes/input-filter.pipe';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { WorkspaceUserProfilComponent } from '../workspace-user-profil/workspace-user-profil.component';

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

  constructor(public userService: UserService) {}

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

  addUserTag() {

  }

  // openDialog() {
  //   let dialog = <HTMLDialogElement>document.getElementById('searched-user-dialog');

  //   dialog.show();
  //   console.log('function works');
  // }

}
