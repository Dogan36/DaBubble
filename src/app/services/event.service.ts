import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private threadOpenStatus = new BehaviorSubject<boolean>(true);
  private channelOpenStatus = new BehaviorSubject<boolean>(true);
  private privateChatOpenStatus = new BehaviorSubject<boolean>(false);
  private newChatOpenStatus = new BehaviorSubject<boolean>(false);
  private workspaceOpenStatus = new BehaviorSubject<boolean>(true);


  constructor() { }

  // Thread Status

  getThreadOpenStatus() {
    return this.threadOpenStatus.asObservable();
  }

  openThread(state:boolean) {
    this.threadOpenStatus.next(state);
  }


  // Channel Status

  getChannelOpenStatus() {
    return this.channelOpenStatus.asObservable();
  }

  openChannel(state:boolean) {
    this.channelOpenStatus.next(state);
  }


  // Private Chat Status

  getPrivateChatOpenStatus() {
    return this.privateChatOpenStatus.asObservable();
  }

  openPrivateChat(state:boolean) {
    this.privateChatOpenStatus.next(state);
  }



  // New Chat Status

  getNewChatOpenStatus() {
    return this.newChatOpenStatus.asObservable();
  }

  openNewChat(state:boolean) {
    this.newChatOpenStatus.next(state);
  }


  // Workspace Status

  getWorkspaceOpenStatus() {
    return this.workspaceOpenStatus.asObservable();
  }

  openWorkspace(state:boolean) {
    this.workspaceOpenStatus.next(state);
  }



  // PrivateChat Windows


    PrivateChatModus() {
      this.openPrivateChat(true);
      this.openChannel(false);
      this.openNewChat(false);
      this.openThread(false);
  
      if (window.innerWidth <= 544) {
        this.openWorkspace(false);
      }
    }

}


