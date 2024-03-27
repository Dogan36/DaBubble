import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private threadOpenStatus = new BehaviorSubject<boolean>(true);

  constructor() { }

  getThreadOpenStatus() {
    return this.threadOpenStatus.asObservable();
  }

  openThread() {
    this.threadOpenStatus.next(true);
  }

  closeThread() {
    this.threadOpenStatus.next(false);
  }
}
