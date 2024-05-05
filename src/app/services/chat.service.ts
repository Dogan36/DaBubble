import { Injectable, inject } from '@angular/core';
import { Firestore, onSnapshot, collection, addDoc, doc, updateDoc, deleteDoc, query, where, getDoc, DocumentData, docData, getDocs, orderBy, limit } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable, Subscription, switchMap } from 'rxjs';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})

export class ChatService {

  private firestore: Firestore = inject(Firestore);
  private authService: AuthService = inject(AuthService);

  currentChat: any
  
  private chatsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public chats$: Observable<any[]> = this.chatsSubject.asObservable();
  private initialized: boolean = false;
  private unsubChats: Subscription | undefined;
  messages: any[] = [];

  private userSubscription: Subscription;
  unsubPrivateChats: any;

  privateChats: {chatRef:string, members:string[]}[] = []

  constructor(private userService: UserService) {
    this.subChats();

    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.unsubPrivateChats = this.subPrivateChats(user.uid);
      }
    });
  }


  ngOnDestory() {
    console.log('destroy')
    this.unsubscribeChats()

    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }

    this.unsubPrivateChats();
  }
 

  private subChats(): Subscription {
    return this.authService.currentUser$.subscribe(user => {
      if (!this.initialized) {
      if (user) {
        try {
          this.fetchChats(user);
          this.authService.logoutEvent.subscribe(() => {
            this.unsubscribeChats();
          });
          this.initialized=true
        } catch (error) {
          console.error("Error fetching chats:", error);
        }
      }}
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
      const chatRef = doc(this.firestore, 'chats', chat.chatRef); // Erstellung der Referenz auf das Chat-Dokument
    const messagesCollectionRef = collection(chatRef, 'messages'); // Erstellung der Referenz auf die Subsammlung "messages" innerhalb des Chats

    console.log("Nachrichtensammlungs-Referenz:", messagesCollectionRef); // Überprüfung der erstellten Referenz auf die Nachrichtensammlung

    const unsubscribe = onSnapshot(messagesCollectionRef, querySnapshot => {

      // Überprüfung, ob Nachrichten vorhanden sind
      if (querySnapshot.empty) {
        console.log("Keine Nachrichten vorhanden.");
        return; // Die Ausführung hier beenden, da keine Nachrichten vorhanden sind
      }

      // Nachrichten verarbeiten, wenn sie vorhanden sind
      querySnapshot.forEach(doc => {
        this.messages.push({ ...doc.data() });
      });

      console.log("Empfangene Nachrichten:", this.messages); // Ausgabe der empfangenen Nachrichten
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



  subPrivateChats(userId: string) {
    const q = query(collection(this.firestore, 'chats'), where('members', 'array-contains', userId));

    return onSnapshot(q, (list) => {

      this.privateChats = [];
  
      list.forEach(element => {

        this.privateChats.push({chatRef: element.id, members: element.data()['members']});

      });
      
      console.log('Das sind alle meine Chats', this.privateChats);
    });
  }



  // start new chat
  async startNewPrivateChat(item: {}) { // item => beide user Refs

    await addDoc(collection(this.firestore, 'chats'), item).catch(
        (err) => { console.error(err) }
      ).then(
        (docRef) => { 
          if (docRef) {
            console.log("Document written with ID: ", docRef);
            // hier update Funktion um die ChatRef in den beiden Usern zu speichern!
            // privateChat öffnen => aktueller Chat
          } else {
            console.error("Failed to get document reference.");
          }
        } 
      ) 
  }


  async addMessageToPrivateChat(message: {}, chatRef:string) {
    // let chatRef = this.chats[this.selectedChat].id;

    await addDoc(collection(this.firestore, `chats/${chatRef}/messages`), message).catch(
        (err) => { console.error(err) }
      ).then(
      (docRef) => { 
        // console.log("Document written with ID: ", docRef)
        console.log('So sieht die Message aus', message);
      }
      ) 
  }


// Eigentlich auch so im channelService, aber für besser Übersicht auch noch mal hier
  toJSONmessage(obj:any) {
    if(obj.reactions.length > 0) {
      return {
        message: obj.message || '',
        member: obj.member,
        reactions: this.toJSONreactions(obj) || [],
        timestamp: obj.timestamp,
        uploadedFile: obj.uploadedFile || []
    }} else {
      return {
        message: obj.message || '',
        member: obj.member,
        timestamp: obj.timestamp,
        uploadedFile: obj.uploadedFile || []
      }
    }
  }


// Eigentlich auch so im channelService, aber für besser Übersicht auch noch mal hier
  toJSONreactions(obj:any) {
    let reactionsArray = [];
    for (let i = 0; i < obj.reactions.length; i++) {
      const reaction = obj.reactions[i];

      reactionsArray.push(reaction.reactUser + "&" + reaction.reactEmoji)
    }
    return reactionsArray;
  }


  searchForMemberInChats(memberId: string) {
    for (let i = 0; i < this.privateChats.length; i++) {
      const chat = this.privateChats[i];

      if (chat.members.includes(memberId)) {
            return true;
        }
    }
    return false;
  }
  

}