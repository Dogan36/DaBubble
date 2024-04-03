import { Injectable, inject } from '@angular/core';
import { Auth, User, createUserWithEmailAndPassword, updateProfile, user, browserSessionPersistence, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo, sendPasswordResetEmail, updateEmail, signOut, sendEmailVerification } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Subscription, from } from 'rxjs';
import { UserType } from '../types/user.class';
import { Firestore, doc, setDoc, updateDoc } from '@angular/fire/firestore';
import { OverlayService } from './overlay.service';
import { setPersistence } from '@firebase/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private overlayService: OverlayService = inject(OverlayService);
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private router: Router = inject(Router);
  currentUser: User | null = null;
  email: string = '';
  password: string = '';
  name: string = '';
  photoURL = './assets/img/profils/standardPic.svg';
  showLogin: boolean = true;
  showSignUp: boolean = false;
  showSignUpPicture: boolean = false;
  showSignUpPictureUpload = false;
  showResetPassword: boolean = false;
  registerError: string = "";
  user$ = user(this.auth);
  userSubscription: Subscription = new Subscription();
  userUid: string = '';
  provider = new GoogleAuthProvider();

  constructor() {
    this.userSubscription = this.user$.subscribe((user: User | null) => {
      this.currentUser = user;
      if (this.currentUser != null) {
        this.userUid = this.currentUser.uid;
        this.router.navigate(['/start']);
      } else {
        this.router.navigate(['']);
      }
    });
  }

  private createUserObject(): UserType {
    return {
      name: this.name,
      email: this.email,
      photoURL: this.photoURL
    };
  }

  async login(): Promise<void> {
    try {
      await setPersistence(this.auth, browserSessionPersistence);
      const userCredential = await signInWithEmailAndPassword(this.auth, this.email, this.password);
      this.overlayService.showOverlay('Anmelden')
      this.currentUser = userCredential.user;
     
      console.log("User UID:", this.userUid);
      setTimeout(() => {
        this.overlayService.hideOverlay();
      }, 3000);
    } catch (error) {
      console.log(error)
      throw error;
    }
  }

  async register(): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: this.name });  
      const userObject: UserType = this.createUserObject();
      const userDocRef = doc(this.firestore, 'users', user.uid);
      await setDoc(userDocRef, userObject);
      await updateDoc(userDocRef, { photoURL: this.photoURL });
      this.overlayService.showOverlay('Konto erfolgreich erstellt!')
      setTimeout(() => {
        this.overlayService.hideOverlay();
        this.toggleLogin()
      }, 3000);
    } catch (error) {
      throw error;
    }
  }

  async updateInfo(name: string, email: string) {
    console.log("User UID:", this.userUid);
    const userDocRef = doc(this.firestore, 'users', this.userUid);
    console.log(userDocRef)
    if (this.currentUser) {
      await updateEmail(this.currentUser, email);
      await updateProfile(this.currentUser, { displayName: name });
      await updateDoc(userDocRef, { email: email, name: name });
   }
  };


  loginWithGoogle() {
    signInWithPopup(this.auth, this.provider)
      .then((result) => {
        this.overlayService.showOverlay('Anmelden')
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential) {
          const token = credential.accessToken;
          this.currentUser = result.user;
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
          const userDocRef = doc(this.firestore, 'users', this.currentUser.uid);
          setDoc(userDocRef, userObject);

          setTimeout(() => {
            this.overlayService.hideOverlay();

          }, 3000);
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

  toggleSignUp() {
    this.showLogin = !this.showLogin;
    this.showSignUp = !this.showSignUp;
  }

  toggleToPicture() {
    this.showSignUp = !this.showSignUp;
    this.showSignUpPicture = !this.showSignUpPicture;
  }

  toggleOwnPicture() {
    this.showSignUpPictureUpload = !this.showSignUpPictureUpload
    this.showSignUpPicture = !this.showSignUpPicture;
  }

  toggleResetPasswort() {
    this.showLogin = !this.showLogin;
    this.showResetPassword = !this.showResetPassword;
  }

  toggleLogin() {
    this.showSignUpPicture = !this.showSignUpPicture;
    this.showLogin = !this.showLogin;
  }

  sendPasswortReset(email: string) {
    sendPasswordResetEmail(this.auth, email)
      .then(() => {
        this.overlayService.showOverlay('<img src="./../assets/img/icons/send_white.svg"> E-Mail gesendet');
        setTimeout(() => {
          this.overlayService.hideOverlay();
          this.toggleResetPasswort()
        }, 3000);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }





  async logout(): Promise<void> {
    try {
      this.overlayService.showOverlay('Abmelden')
      await signOut(this.auth);
      setTimeout(() => {
        this.overlayService.hideOverlay();
      }, 3000);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
}
