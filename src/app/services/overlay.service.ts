import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {

  overlayShow: boolean = false;
  overlayContent: any = null;
  overlayStyle: string = '';

  constructor() { }

  /**
   * This function shows the overlay
   * @param content {any} This is the content to be shown on the overlay
   */
  showOverlay(content: any) {
    this.overlayContent = content;
    this.overlayShow = true;
    this.overlayStyle = '';
  }

  /**
   * This function shows the error overlay
   * @param content {any} This is the error to be shown on the overlay
   */
  showOverlayError(content: any) {
    this.overlayContent = content;
    this.overlayStyle = 'error'; // Setzen des Stils auf 'error'
    this.overlayShow = true;
  }

  /**
   * This function hides the overlay
   */
  hideOverlay() {
    this.overlayShow = false
  }
}