import { Injectable, inject } from '@angular/core';
import { Firestore, onSnapshot, collection, addDoc, doc, updateDoc, deleteDoc, query, where, getDoc, DocumentData, docData, getDocs, orderBy, limit } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable, Subscription, switchMap } from 'rxjs';
import { UserService } from './user.service';
import { User } from '../models/user.class';
import { Data } from '@angular/router';




@Injectable({
  providedIn: 'root'
})



export class ChatService {
  private firestore: Firestore = inject(Firestore);
  private authService: AuthService = inject(AuthService);
  constructor(private userService: UserService) { this.unsubChats = this.subChats() }

  currentChat: any

  private chatsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public chats$: Observable<any[]> = this.chatsSubject.asObservable();
  unsubChats: any

  subChats() {
    return new Promise<void>((resolve, reject) => {
      this.unsubChats = this.authService.currentUser$.subscribe(user => {
        if (user) {
          try {
            this.fetchChats(user);
            resolve();
          } catch (error) {
            reject(error);
          }
        }
      });
    });
  }

  async fetchChats(user: any) {
    const userDocRef = doc(this.firestore, 'users', user.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      const chatRefs = userData['chatRefs'];

      if (chatRefs && chatRefs.length > 0) {
        const chatPromises = chatRefs.map(async (chatRef: string) => {
          await this.processChat(chatRef, user.uid);
        });

        await Promise.all(chatPromises);

        // Sortiere die Chats basierend auf dem Zeitstempel der letzten Nachricht
        this.sortChatsByLastMessageTimestamp();
      }
    }
  }

  async processChat(chatRef: string, currentUserUid: string) {
    const chatDocRef = doc(this.firestore, 'chats', chatRef);
    const chatSnapshot = await getDoc(chatDocRef);

    if (chatSnapshot.exists()) {
      const chatData = chatSnapshot.data();
      const memberIds = chatData['members'];

      if (memberIds.length > 1) {
        const otherMemberData = await this.getOtherMemberData(chatRef, currentUserUid);
        const readBy = await this.isReadByCurrentUser(chatRef, currentUserUid);
        let lastMessageTimestamp = chatData['timestamp'] || 0;
        const chat = {
          chatRef,
          name: otherMemberData.name,
          photoURL: otherMemberData.photoURL,
          readBy,
          lastMessageTimestamp
        };

        // Füge den neuen Chat der chatsSubject hinzu
        this.chatsSubject.next([...this.chatsSubject.value, chat]);
      } else if (memberIds.length === 1) {
        const chat = {
          chatRef,
          name: this.authService.currentUser.name,
          photoURL: this.authService.currentUser.photoURL,
          lastMessageTimestamp: 99999999999999,
          ownChat: true
        };

        // Füge den neuen Chat der chatsSubject hinzu
        this.chatsSubject.next([...this.chatsSubject.value, chat]);
      }
    }
  }

  async getOtherMemberData(chatRef: string, currentUserUid: string): Promise<any> {
    const chatDocRef = doc(this.firestore, 'chats', chatRef);
    const chatSnapshot = await getDoc(chatDocRef);

    if (chatSnapshot.exists()) {
      const chatData = chatSnapshot.data();
      const memberIds = chatData['members'];
      const otherMemberUid = memberIds.find((id: string) => id !== currentUserUid);

      if (otherMemberUid) {
        const otherMemberDocRef = doc(this.firestore, 'users', otherMemberUid);
        const otherMemberSnapshot = await getDoc(otherMemberDocRef);

        if (otherMemberSnapshot.exists()) {
          return otherMemberSnapshot.data();
        }
      }
    }
    return null; // Rückgabe, falls keine Daten gefunden wurden
  }

  async isReadByCurrentUser(chatRef: string, currentUserUid: string): Promise<boolean> {
    const chatDocRef = doc(this.firestore, 'chats', chatRef); // Annahme: Die Chats sind unter 'chats' gespeichert
    const chatSnapshot = await getDoc(chatDocRef);
    if (chatSnapshot.exists()) {
      const chatData = chatSnapshot.data();
      const readBy = chatData?.['readBy'] || [];
      return readBy.includes(currentUserUid);
    } else {
      return false;
    }
  }

  // async getMessageLastTimestamp(chatRef: string): Promise<number> {
  //   const chatMessagesRef = collection(this.firestore, `chats/${chatRef}/messages`);
  //   const querySnapshot = await getDocs(query(chatMessagesRef, orderBy('timestamp', 'desc'), limit(1)));
  //   if (!querySnapshot.empty) {
  //     const lastMessageDoc = querySnapshot.docs[0];
  //     const lastMessageData = lastMessageDoc.data();
  //     return lastMessageData['timestamp'] || 0;
  //   }
  //   return 0; // Rückgabe eines Standardzeitstempels, wenn keine Nachrichten vorhanden sind
  // }


  sortChatsByLastMessageTimestamp() {
    const sortedChats = this.chatsSubject.value.slice().sort((a, b) => {
      return b.lastMessageTimestamp - a.lastMessageTimestamp;
    });
    this.chatsSubject.next(sortedChats);
  }

  unsubscribeChats() {
    if (this.unsubChats) {
      this.unsubChats.unsubscribe();
    }
  }

  getChats() {
    return this.chats$;
  }

  getChatMessages(chat: any) {
    console.log(chat); // Überprüfung der übergebenen chatRef
  
    const chatRef = doc(this.firestore, 'chats', chat.chatRef); // Erstellung der Referenz auf das Chat-Dokument
    const messagesCollectionRef = collection(chatRef, 'messages'); // Erstellung der Referenz auf die Subsammlung "messages" innerhalb des Chats
  
    console.log("Nachrichtensammlungs-Referenz:", messagesCollectionRef); // Überprüfung der erstellten Referenz auf die Nachrichtensammlung
  
    const unsubscribe = onSnapshot(messagesCollectionRef, querySnapshot => {
      const messages: any[] = [];
  
      // Überprüfung, ob Nachrichten vorhanden sind
      if (querySnapshot.empty) {
        console.log("Keine Nachrichten vorhanden.");
        return; // Die Ausführung hier beenden, da keine Nachrichten vorhanden sind
      }
  
      // Nachrichten verarbeiten, wenn sie vorhanden sind
      querySnapshot.forEach(doc => {
        messages.push({...doc.data()});
      });
  
      console.log("Empfangene Nachrichten:", messages); // Ausgabe der empfangenen Nachrichten
    }, error => {
      console.error("Fehler beim Abonnieren von Nachrichten:", error); // Fehlerbehandlung beim Abonnieren von Nachrichten
    });
  
    // Überprüfung, ob das Observable beendet wird
    console.log("Beende Abonnement auf Nachrichten.");
  
    return () => {
      unsubscribe();
      console.log("Abonnement auf Nachrichten beendet."); // Bestätigung, dass das Abonnement beendet wurde
    };
  }
  
}