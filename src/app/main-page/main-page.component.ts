import { Component, inject } from '@angular/core';
import { WorkspaceMenuComponent } from './workspace-menu/workspace-menu.component';
import { ChatBoardComponent } from './chat-board/chat-board.component';
import { ThreadBoardComponent } from './thread-board/thread-board.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [WorkspaceMenuComponent, ChatBoardComponent, ThreadBoardComponent, MatSidenavModule, MatButtonModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {
  authService: AuthService = inject(AuthService);
  workspaceOpen = true;
  threadOpen = true;

  closeThread() {
    this.threadOpen = false;
  }

  ngOnInit() {
    console.log(this.authService.userUid)
  }
  test(){
    console.log(this.authService.userUid)
  }

  toggleSideNav() {
    this.workspaceOpen = !this.workspaceOpen;
  }
}
