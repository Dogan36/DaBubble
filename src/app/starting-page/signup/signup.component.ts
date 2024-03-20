import { Component } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  
  email:string ='test';
  password:string ='test'
 


}
