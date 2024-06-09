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

  /** Defines threadOpenStatus as an Observable
   * 
   * @returns 
   */
  getThreadOpenStatus() {
    return this.threadOpenStatus.asObservable();
  }


  /**
   * Sets threadOpenStatus state new
   * 
   * @param state 
   */
  openThread(state:boolean) {
    this.threadOpenStatus.next(state);
  }


  // Channel Status

  /**
   * Defines channelOpenStatus as an Observable
   * 
   * @returns 
   */
  getChannelOpenStatus() {
    return this.channelOpenStatus.asObservable();
  }


  /**
   * Sets channelOpenStatus state new
   * 
   * @param state 
   */
  openChannel(state:boolean) {
    this.channelOpenStatus.next(state);
  }


  // Private Chat Status

  /**
   * Defines privateChatOpenStatus as an Observable
   * 
   * @returns 
   */
  getPrivateChatOpenStatus() {
    return this.privateChatOpenStatus.asObservable();
  }


  /**
   * Sets privateChatOpenStatus state new
   * 
   * @param state 
   */
  openPrivateChat(state:boolean) {
    this.privateChatOpenStatus.next(state);
  }


  // New Chat Status

  /**
   * Defines newChatOpenStatus as an Observable
   * 
   * @returns 
   */
  getNewChatOpenStatus() {
    return this.newChatOpenStatus.asObservable();
  }


  /**
   * Sets privateChatOpenStatus state new
   * 
   * @param state 
   */
  openNewChat(state:boolean) {
    this.newChatOpenStatus.next(state);
  }


  // Workspace Status

  /**
   * Defines workspaceOpenStatus as an Observable
   * 
   * @returns 
   */
  getWorkspaceOpenStatus() {
    return this.workspaceOpenStatus.asObservable();
  }


  /**
   * Sets workspaceOpenStatus state new
   * 
   * @param state 
   */
  openWorkspace(state:boolean) {
    this.workspaceOpenStatus.next(state);
  }


  // PrivateChat Windows

    /**
     * Calls functins to set variables to open private chat board
     */
    PrivateChatModus() {
      this.openPrivateChat(true);
      this.openChannel(false);
      this.openNewChat(false);
      this.openThread(false);
      if (window.innerWidth <= 544) {
        this.openWorkspace(false);
      }
    }


  // ChannelChat Windows

    /**
     * Calls functins to set variables to open channel board
     */
    ChannelModus() {
      this.openChannel(true);
      this.openPrivateChat(false);
      this.openNewChat(false);
      if (window.innerWidth <= 792) {
        this.openWorkspace(false);
        this.openThread(false);
      } else if(window.innerWidth > 792 && window.innerWidth <= 1440) {
        this.openThread(false);
      } else {
        this.openThread(true);
      }
    }


  // ChannelChat Windows

    /**
     * Calls functins to set variables to open thread chat board
     */
    ThreadModus() {
      this.openThread(true);
      this.openPrivateChat(false);
      this.openNewChat(false);
      if (window.innerWidth <= 792) {
        this.openWorkspace(false);
        this.openChannel(false);
      } else if(window.innerWidth > 792 && window.innerWidth <= 1440) {
        this.openChannel(false);
      } else {
        this.openChannel(true);
      }
    }
}


