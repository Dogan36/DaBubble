import { Injectable } from '@angular/core';


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