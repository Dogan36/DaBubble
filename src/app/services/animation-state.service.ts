import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimationStateService {
  private animatedOnce: boolean = false;

  get isAnimatedOnce(): boolean {
    return this.animatedOnce;
  }

  set isAnimatedOnce(value: boolean) {
    this.animatedOnce = value;
  }
}
