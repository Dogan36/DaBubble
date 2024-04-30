import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private threadOpenStatus = new BehaviorSubject<boolean>(true);
  private channelOpenStatus = new BehaviorSubject<boolean>(true);
  private privateChatOpenStatus = new BehaviorSubject<boolean>(false);


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
}
