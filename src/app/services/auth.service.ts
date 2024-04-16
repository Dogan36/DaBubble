import { Injectable, inject } from '@angular/core';
import { Auth, User, createUserWithEmailAndPassword, updateProfile, user, browserSessionPersistence, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo, sendPasswordResetEmail, updateEmail, signOut, sendEmailVerification, onAuthStateChanged } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, from, map } from 'rxjs';
import { UserType } from '../types/user.class';
import { Firestore, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { OverlayService } from './overlay.service';
import { setPersistence } from '@firebase/auth';
import { LoginService } from './login.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private overlayService: OverlayService = inject(OverlayService);
  private loginService: LoginService = inject(LoginService);
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private router: Router = inject(Router);

  currentUser: User | null = null;
  email: string = '';
  password: string = '';
  name: string = '';
chatRefs:any
  photoURL = './assets/img/profils/standardPic.svg';
  registerError: string = "";
  user$ = user(this.auth);
  provider = new GoogleAuthProvider();

  constructor() {
  
    this.auth.onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
       
        this.router.navigate(['/start']);
  
      } else {
        this.currentUser = null;
        this.router.navigate(['/']);
      }
    });
  }

  

   public getCurrentUser(): Observable<User | null> {
    return this.user$
  }

  private createUserObject(): UserType {
    return {
      name: this.name,
      email: this.email,
      photoURL: this.photoURL,
      chatRefs: this.chatRefs
    };
  }

  async login(): Promise<void> {
    try {
      await setPersistence(this.auth, browserSessionPersistence);
      const userCredential = await signInWithEmailAndPassword(this.auth, this.email, this.password);
      this.overlayService.showOverlay('Anmelden')
      setTimeout(() => {
        this.overlayService.hideOverlay();
      }, 1500);
      this.currentUser = userCredential.user;

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
      await updateProfile(user, { photoURL: this.photoURL });
      this.chatRefs = [user.uid];
      const userObject: UserType = this.createUserObject();
      const userDocRef = doc(this.firestore, 'users', user.uid);
      await setDoc(userDocRef, userObject);
      await updateDoc(userDocRef, { photoURL: this.photoURL });
     //erst ab hier zulassen dass  die Registrierung fertig ist und der user  weiterleitet wird
      this.overlayService.showOverlay('Konto erfolgreich erstellt!')
      setTimeout(() => {
        this.overlayService.hideOverlay();
        this.loginService.toggleLogin()
      }, 1500);
    } catch (error) {
      throw error;
    }
  }

  async updateInfo(name: string, email: string) {

    const userDocRef = doc(this.firestore, 'users', this.currentUser?.uid as string);

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

          }, 1500);
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

  sendPasswortReset(email: string) {
    sendPasswordResetEmail(this.auth, email)
      .then(() => {
        this.overlayService.showOverlay('<img src="./../assets/img/icons/send_white.svg"> E-Mail gesendet');
        setTimeout(() => {
          this.overlayService.hideOverlay();
          this.loginService.toggleResetPasswort()
        }, 1500);
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
      }, 1500);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  async getUserPhotoURL(userId: string): Promise<string> {
    try {
      const userDocRef = doc(this.firestore, 'users', userId);
      const userSnapshot = await getDoc(userDocRef);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        return userData['photoURL'] || "./assets/img/profils/standardPic.svg";
      } else {
        return "./assets/img/profils/standardPic.svg";
      }
    } catch (error) {
      console.error('Error getting user photo URL:', error);
      throw error;
    }
  }
}
