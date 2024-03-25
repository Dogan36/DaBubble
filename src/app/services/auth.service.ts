import { Injectable, inject } from '@angular/core';
import { Auth, User, createUserWithEmailAndPassword, updateProfile, user, onAuthStateChanged, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Subscription, from } from 'rxjs';
import { UserType } from '../types/user.class';
import { Firestore, doc, setDoc, } from '@angular/fire/firestore';

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
  photoURL = './assets/img/profils/standardPic.svg';
  selectedProfilePic: string = '';

  showLogin: boolean = true;
  showSignUpPicture: boolean = false;
  showResetPassword: boolean = false;
  showSignUp: boolean = false;

  user$ = user(this.auth);
  userSubscription: Subscription = new Subscription();
  userUid: string = ''
  provider = new GoogleAuthProvider();
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
      photoURL: this.photoURL
    };
  }




  async login() {
    await signInWithEmailAndPassword(this.auth, this.email, this.password)
      .then((userCredential) => {
        this.userUid = userCredential.user.uid;
        console.log(this.userUid)

        this.router.navigate(['']);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  async register() {
    const userCredential = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
    console.log(userCredential)
    const user = userCredential.user;
    await updateProfile(user, { displayName: this.name });
    await updateProfile(user, { photoURL: this.photoURL });
    const userObject: UserType = this.createUserObject();
    const userDocRef = doc(this.firestore, 'users', user.uid);
    await setDoc(userDocRef, userObject);
  }



  loginWithGoogle() {
    signInWithPopup(this.auth, this.provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential) {
          const token = credential.accessToken;
          const user = result.user;
          const profile = getAdditionalUserInfo(result)?.profile
          if (profile !== null && profile !== undefined) {
            if (typeof profile['name'] === 'string') {
              this.name = profile['name'];
            }
            if (typeof profile['picture'] === 'string') {
              this.photoURL = profile['picture'];
            }
            if (typeof profile['email'] === 'string') {
              this.email = profile['email'];
            }
          }
          const userObject: UserType = this.createUserObject()
          const userDocRef = doc(this.firestore, 'users', user.uid);
          setDoc(userDocRef, userObject);
          this.userUid = user.uid;
          this.router.navigate(['']);
        }
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }
}