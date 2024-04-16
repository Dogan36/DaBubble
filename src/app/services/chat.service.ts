import { Injectable, inject } from '@angular/core';
import { Firestore, onSnapshot, collection, addDoc, doc, updateDoc, deleteDoc, query, where, getDoc, DocumentData } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable, switchMap } from 'rxjs';
import { UserService } from './user.service';
import { User } from '../models/user.class';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private firestore: Firestore = inject(Firestore);
  private authService: AuthService = inject(AuthService);
  constructor(private userService: UserService) { this.unsubChats = this.subChats() }

  currentChat: any
  messages: any[] = []
  unsubChats

  subChats() {
    return new Promise((resolve, reject) => {
        const unsubscribe = this.authService.getCurrentUser().subscribe(async (user) => {
            if (user) {
                try {
                    await this.fetchChatMessages(user);
                    resolve(unsubscribe);
                } catch (error) {
                    reject(error);
                }
            } else {
                console.log('Kein aktiver Benutzer.');
                reject(new Error('Kein aktiver Benutzer.'));
            }
        });
    });
}

async fetchChatMessages(user:any) {
    const userDocRef = doc(this.firestore, 'users', user.uid);
    const userSnapshot = await getDoc(userDocRef);
    if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const chatRefs = userData['chatRefs'];
        if (chatRefs && chatRefs.length > 0) {
            const chatRef = chatRefs[0];
            const chatMessagesRef = collection(this.firestore, `chats/${chatRef}/messages`);
            onSnapshot(chatMessagesRef, (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(doc.data());
                });
            });
        } else {
            console.log('Keine Chat-Referenz gefunden.');
            throw new Error('Keine Chat-Referenz gefunden.');
        }
    } else {
        console.log('Benutzerdokument existiert nicht.');
        throw new Error('Benutzerdokument existiert nicht.');
    }
}

  async getMessageUsernames(message: any): Promise<{ name: string, photoURL: string, uid: string }[]> {
    const allUserUids: string[] = message.users || [];
    console.log(allUserUids)
    const otherUserUids = allUserUids.filter(uid => uid !== this.authService.currentUser?.uid);
    const otherUserNames: { name: string, photoURL: string, uid: string }[] = [];
    if (allUserUids.length > 1) {
      for (const uid of otherUserUids) {
        const userDocRef = doc(this.firestore, 'users', uid);
        const userSnapshot = await getDoc(userDocRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          const name = userData['name'] || 'Unknown';
          const photoURL = userData['photoURL'] || ''; // Falls photoURL nicht vorhanden ist, leeres String verwenden
          otherUserNames.push({ name, photoURL, uid });
          console.log(userData)
          console.log(otherUserNames)

        } else {
          console.log('User with UID', uid, 'does not exist');
        }
      }
    } else {

      const name = this.authService.currentUser?.displayName || 'Unknown';
      const uid = this.authService.currentUser?.uid as string;
      const photoURL = this.authService.photoURL || ''; // Falls photoURL nicht vorhanden ist, leeres String verwenden
      otherUserNames.push({ name, photoURL, uid });
    }
    return otherUserNames;
  }
}


