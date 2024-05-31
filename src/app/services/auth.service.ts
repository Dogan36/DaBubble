import { EventEmitter, Injectable, inject } from '@angular/core';
import { Auth, User, createUserWithEmailAndPassword, updateProfile, user, browserSessionPersistence, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo, sendPasswordResetEmail, updateEmail, signOut, sendEmailVerification, onAuthStateChanged } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, from, map } from 'rxjs';
import { UserType } from '../types/user.class';
import { Firestore, collection, doc, getDoc, onSnapshot, setDoc, updateDoc } from '@angular/fire/firestore';
import { OverlayService } from './overlay.service';
import { setPersistence } from '@firebase/auth';
import { LoginService } from './login.service';



@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private _currentUserSubject: BehaviorSubject<UserType | null> = new BehaviorSubject<UserType | null>(null);
  currentUser$ = this._currentUserSubject.asObservable();
  currentUser: any;
  user:any
  uid: string = '';
  email: string = '';
  password: string = '';
  name: string = '';
  createdAt: string = '';
  photoURL = './assets/img/profils/standardPic.svg';
  chatRefs: any;
  public ownChatEventEmitted: boolean = false;
  public joinStartingChannelsEventEmitted: boolean = false;
  registerError: string = ''

  provider = new GoogleAuthProvider();
  public logoutEvent: EventEmitter<void> = new EventEmitter<void>();
  public generateOwnChatEvent: EventEmitter<void> = new EventEmitter<void>();
  public joinStaringChannelsEvent: EventEmitter<void> = new EventEmitter<void>();
  
  constructor( 
    private overlayService: OverlayService,
    private loginService: LoginService,
    public auth: Auth,
    private firestore: Firestore,
    private router: Router,
    ){
    this.setPersistence();
    this.auth.onAuthStateChanged(user => {
      if (user) {
        console.log(user)
        this.user = user
        this.uid = user.uid;
        
        const userDocRef = doc(this.firestore, 'users', this.uid);
        onSnapshot(userDocRef, (doc) => {
          if (!doc.exists()) {
            this.router.navigate(['/']);
          } else {
            this.router.navigate(['/home'])
            this.currentUser = {...doc.data() } as UserType;
          
            this._currentUserSubject.next(this.currentUser);
          }
        }, (error) => {
          console.error('Error fetching user document:', error);
          // Handle error
        });
      } else {
        this._currentUserSubject.next(null);
        if(this.router.url !== '/reset-password'){   this.router.navigate(['/']);}
     
      }
    });
  }

  private setPersistence(): void {
 
    // Setzen der Persistenzoption auf "local"
    setPersistence(this.auth, browserSessionPersistence)
      .then(() => {
      })
      .catch((error) => {
        console.error('Error setting Firebase persistence:', error);
      });
  }

  private createUserObject(): UserType {
    return {
      uid: this.uid,
      name: this.name,
      email: this.email,
      photoURL: this.photoURL,
      chatRefs: this.uid,
      createdAt: this.createdAt
    };
  }
  handleImageError(){
    this.user.photoURL = './assets/img/profils/standardPic.svg'
  }
  async login(): Promise<void> {
    console.log('loginCalled')
    try {
      await setPersistence(this.auth, browserSessionPersistence);
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
      this.overlayService.showOverlay('Anmelden')
      setTimeout(() => {
        this.overlayService.hideOverlay();
      }, 1500);

      this.router.navigate(['/home']);

    } catch (error) {
      console.log(error)
      throw error;
    }
  }

  async register(): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      const user = userCredential.user;
      await updateProfile(user, {
        displayName: this.name
      });
      await updateProfile(user, {
        photoURL: this.photoURL
      });
      this.chatRefs = [user.uid];
      const userObject: UserType = this.createUserObject();
      const userDocRef = doc(this.firestore, 'users', user.uid);
      await setDoc(userDocRef, userObject);
        this.generateOwnChatEvent.emit(); // Emitiere das Event
        this.joinStaringChannelsEvent.emit(); // Emitiere das Event
      this.loginService.toggleLogin
      //erst ab hier zulassen dass  die Registrierung fertig ist und der user weiterleitet wird
      this.overlayService.showOverlay('Konto erfolgreich erstellt!')
      setTimeout(() => {
        this.overlayService.hideOverlay();
        this.router.navigate(['/home']);
      }, 1500);
    } catch (error) {
      throw error;
    }
  }

  async updateInfo(name: string, email: string) {
    const userDocRef = doc(this.firestore, 'users', this.currentUser.uid);
    try {
      await updateEmail(this.user, email);
      await updateDoc(userDocRef, { email: email, name: name });
      this.overlayService.showOverlay('Daten erfolgreich geändert');
      setTimeout(() => {
        this.overlayService.hideOverlay();
      }, 1500);
    } catch (error) {
    
      this.overlayService.showOverlayError('Fehler beim Aktualisieren der Daten');
      setTimeout(() => {
        this.overlayService.hideOverlay();
      }, 1500);
    }
  }

  async updatePicture(picture:string) {
    const userDocRef = doc(this.firestore, 'users', this.currentUser.uid);
    await updateDoc(userDocRef, {photoURL:picture});
    this.overlayService.showOverlay('Foto erfolgreich geändert')
    setTimeout(() => {
      this.overlayService.hideOverlay();
   
    }, 1500);
  };


  loginWithGoogle() {
    signInWithPopup(this.auth, new GoogleAuthProvider())
      .then((result) => {
        this.overlayService.showOverlay('Anmelden');
        const credential = GoogleAuthProvider.credentialFromResult(result);
       
        if (credential) {
          const userData: UserType = {
            uid: result.user.uid,
            email: result.user.email || '',
            name: result.user.displayName || '',
            photoURL: result.user.photoURL || '',
            chatRefs:[result.user.uid],
          createdAt:''
          };
          const userDocRef = doc(this.firestore, 'users', result.user.uid);
          //check if user  already exists in the database and create it if not
          getDoc(userDocRef).then((docSnapshot) => {
              if (!docSnapshot.exists()) {
                setDoc(userDocRef, userData);
                if (!this.ownChatEventEmitted) {
               
                  this.generateOwnChatEvent.emit(); // Emitiere das Event
                  this.joinStaringChannelsEvent.emit(); // Emitiere das Event
                }
              }}
          );
          this
          this._currentUserSubject.next(userData); // Aktualisieren Sie currentUser im BehaviorSubject
          this.router.navigate(['/home']);
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
      this._currentUserSubject.next(null); 
      this.currentUser = null
      this.logoutEvent.emit();
      this.ownChatEventEmitted = false;
      this.joinStartingChannelsEventEmitted = false;
      this.overlayService.showOverlay('Abmelden')
      await signOut(this.auth);
      setTimeout(() => {
        this.overlayService.hideOverlay();
      }, 1500);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  async registerGuest(): Promise<string> {
    try {
      const randomNum = Math.floor(Math.random() * 10000); // Zufällige Zahl generieren
      const email = `guest${randomNum}@guest.de`; // E-Mail-Adresse mit zufälliger Zahl erstellen
      
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, '1234567');
      const user = userCredential.user;
  
      const userData: UserType = {
        uid: user.uid,
        name: 'Guest', // Name des Gastbenutzers
        email: email, // E-Mail-Adresse des Gastbenutzers mit zufälliger Zahl
        photoURL: './assets/img/profils/standardPic.svg', // Profilbild des Gastbenutzers (optional)
        chatRefs: [],
        createdAt: user.metadata?.creationTime

      };
  
      await updateProfile(user, {
        displayName: userData.name
      });
      await updateProfile(user, {
        photoURL: userData.photoURL
      });
      const userDocRef = doc(this.firestore, 'users', user.uid);
      await setDoc(userDocRef, userData);
      this.overlayService.showOverlay('Konto erfolgreich erstellt!')
      console.log(this.ownChatEventEmitted)
      this.generateOwnChatEvent.emit();
      this.joinStaringChannelsEvent.emit();
      setTimeout(() => {
        this.overlayService.hideOverlay();
        this.router.navigate(['/home']);
      }, 1500);
      return user.uid; // Rückgabe der uid des registrierten Gastbenutzers
    } catch (error) {
      console.error('Error registering guest user:', error);
      throw error;
    }
  }
  
  async loginGuest(guestUserId: string): Promise<void> {
  
    try {
      const email = await this.getEmailFromFirebase(guestUserId);
      await setPersistence(this.auth, browserSessionPersistence);
      await signInWithEmailAndPassword(this.auth, email, '1234567');
      this.overlayService.showOverlay('Anmelden')
      setTimeout(() => {
        this.overlayService.hideOverlay();
      }, 1500);

      this.router.navigate(['/home']);

    } catch (error) {
      console.log(error)
      throw error;
    }
  }

  private async getEmailFromFirebase(userId: string): Promise<string> {
    const userDocRef = doc(this.firestore, 'users', userId);
    const docSnapshot = await getDoc(userDocRef);
    if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        return userData['email'];
    } else {
      return ''
    }
}

}
