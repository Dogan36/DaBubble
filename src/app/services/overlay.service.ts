import { Injectable } from '@angular/core';
import { ConfirmationOverlayComponent } from '../confirmation-overlay/confirmation-overlay.component';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {

overlayShow:boolean = false;
overlayContent:any = null;
overlayStyle:string = '';

  constructor() {}
showOverlay(content: any){
  this.overlayContent = content;
  this.overlayShow=true;
  this.overlayStyle = '';
}

showOverlayError(content: any){
  this.overlayContent = content;
  this.overlayStyle = 'error'; // Setzen des Stils auf 'error'
  this.overlayShow=true;
}
 hideOverlay(){
  this.overlayShow=false
 }

}