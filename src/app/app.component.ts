import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmationOverlayComponent } from './confirmation-overlay/confirmation-overlay.component';
import { OverlayService } from './services/overlay.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ConfirmationOverlayComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  title = 'dabubble';
  overlayService: OverlayService = inject(OverlayService)
}



  // ngOnInit() {
  //   if (window.innerWidth > 544 && window.innerWidth <= 1440) {
  //     this.evtSvc.openChannel(true);
  //     this.evtSvc.openPrivateChat(false);
  //     this.evtSvc.openThread(false);
  //     this.evtSvc.openNewChat(false);
  //   }
  //   if (window.innerWidth <= 544) {
  //     this.evtSvc.openChannel(false);
  //     this.evtSvc.openPrivateChat(false);
  //     this.evtSvc.openThread(false);
  //     this.evtSvc.openNewChat(false);
  //   }
  // }


  // openChanel() {
  //   this.evtSvc.openChannel(true);
  //   this.evtSvc.openPrivateChat(false);
  //   this.evtSvc.openNewChat(false);
    
  //   if (window.innerWidth <= 544) {
  //     this.evtSvc.openWorkspace(false);
  //     this.evtSvc.openThread(false);
  //   } else {
  //     this.evtSvc.openThread(true);
  //   }

  //   if (window.innerWidth > 544 && window.innerWidth <= 1440) {
  //     this.evtSvc.openChannel(true);
  //     this.evtSvc.openPrivateChat(false);
  //     this.evtSvc.openThread(false);
  //     this.evtSvc.openNewChat(false);
  //   }
  // }