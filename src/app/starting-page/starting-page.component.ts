import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

import { getAuth, User, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-starting-page',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    CommonModule,
    
  ],
  templateUrl: './starting-page.component.html',
  styleUrl: './starting-page.component.scss'
})

export class StartingPageComponent {

  private router: Router = inject(Router);
 
  email: string = '';
  password: string = '';

  async login() {

  }

  async loginAsGuest() {
   
  }

  toggleToResetPassword(){
    
  }
}
