import { Injectable, inject } from '@angular/core';
import { Auth, User, createUserWithEmailAndPassword, updateProfile, user, onAuthStateChanged, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Subscription, from } from 'rxjs';
import { UserType } from '../types/user.class';
import { Firestore, doc, setDoc,} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private router: Router = inject(Router);



  email: string = '';
  password: string = '';
  name: string = '';
  selectedProfilePic: string = '';

  showLogin:boolean = true;
  showSignUpPicture: boolean = false;
  showResetPassword: boolean = false;
  showSignUp: boolean = false;
 
  user$ = user(this.auth);
  userSubscription: Subscription = new Subscription();
  userUid:string=''
  constructor() {
    this.userSubscription = this.user$.subscribe((aUser: User | null) => {
      //handle user state changes here. Note, that user will be null if there is no currently logged in user.
    })
  }

  private createUserObject(): UserType {
    return {
      name: this.name,
      email: this.email,
      password: this.password,
      image: this.selectedProfilePic
    };
  }

  async toggleToChooseProfilePicture() {
    this.showSignUpPicture = true;
    this.showSignUp = false;
  }

  async register() {
      const userCredential = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      const user = userCredential.user;
      console.log('Registered user:', user);
      await updateProfile(user, { displayName: this.name });
      const userObject: UserType = this.createUserObject();
      console.log('User object:', userObject);
      const userDocRef = doc(this.firestore, 'users', user.uid);
      await setDoc(userDocRef, userObject);
  }

  async login(){
    await signInWithEmailAndPassword(this.auth, this.email, this.password)
    .then((userCredential) => {
      this.userUid = userCredential.user.uid;
      this.router.navigate(['']);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  }


  ngOnDestroy() {
    // when manually subscribing to an observable remember to unsubscribe in ngOnDestroy
    this.userSubscription.unsubscribe();
  }
}