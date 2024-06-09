import { Injectable, inject } from '@angular/core';
import { Firestore, onSnapshot, collection, addDoc, doc, updateDoc, deleteDoc, query, where, getDoc, DocumentData, docData, getDocs, orderBy, limit } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable, Subscription, switchMap } from 'rxjs';
import { UserService } from './user.service';
import { Message } from '../models/message.class';
import { PrivateChat } from '../models/privateChat.class';
import { EventService } from './event.service';


@Injectable({
  providedIn: 'root'
})

export class ChatService {
  private firestore: Firestore = inject(Firestore);
  private authService: AuthService = inject(AuthService);

  currentChat: any;
  selChatIndex: number = 0;
  selChatRef: string = '';

  private chatsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public chats$: Observable<any[]> = this.chatsSubject.asObservable();
  private initialized: boolean = false;
  private unsubChats: Subscription | undefined;
  messages: Message[] = [];

  private userSubscription: Subscription;
  unsubPrivateChats: any;
  unsubPrivateChatMessages!: Function;

  privateChats: PrivateChat[] = []

  newChatStarted = false;


  constructor(private userService: UserService, private evtSvc: EventService) {
    // this.subChats();
    this.authService.logoutEvent.subscribe(() => {
      this.clearChats();
    });
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.authService.generateOwnChatEvent.subscribe(() => {
        if (this.authService.ownChatEventEmitted == false) {
          this.startNewPrivateChat({ members: [this.authService.uid], timestamp: Date.now() }, 'chats');
          this.authService.ownChatEventEmitted = true
        }
      });
      if (user) {
        this.unsubPrivateChats = this.subPrivateChats(user.uid);
      }
    });
  }


  /**
   * Sets privateChats variable to []
   */
  clearChats() {
    this.privateChats = [];
  }


  /**
   * Unsubscribes subscription
   */
  ngOnDestory() {
    this.authService.ownChatEventEmitted = false
    this.unsubscribeChats()
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    this.unsubPrivateChats();
    this.unsubPrivateChatMessages();
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
    this.messages = [];
    const chatRef = doc(this.firestore, 'chats', chat.chatRef); // Erstellung der Referenz auf das Chat-Dokument
    const messagesCollectionRef = collection(chatRef, 'messages'); // Erstellung der Referenz auf die Subsammlung "messages" innerhalb des Chats
    const unsubscribe = onSnapshot(messagesCollectionRef, querySnapshot => {
      // Überprüfung, ob Nachrichten vorhanden sind
      if (querySnapshot.empty) {
        return; // Die Ausführung hier beenden, da keine Nachrichten vorhanden sind
      }
      // Nachrichten verarbeiten, wenn sie vorhanden sind
      querySnapshot.forEach(doc => {
        this.messages.push(this.setMessageObj(doc.data(), doc.id));
      });
      // console.log("Empfangene Nachrichten:", this.messages); // Ausgabe der empfangenen Nachrichten
    }, error => {
      console.error("Fehler beim Abonnieren von Nachrichten:", error); // Fehlerbehandlung beim Abonnieren von Nachrichten
    });
    // Überprüfung, ob das Observable beendet wird
    console.log("Beende Abonnement auf Nachrichten.");
    return () => {
      unsubscribe();
    };
  }


  /**
   * Subscribes all private chats of signed user and defines privateChats array
   * 
   * @param userId - signed user document ref
   * @returns 
   */
  subPrivateChats(userId: string) {
    const q = query(collection(this.firestore, 'chats'), where('members', 'array-contains', userId));
    return onSnapshot(q, (list) => {
      this.privateChats = [];
      list.forEach(element => {
        this.privateChats.push({ chatId: element.id, members: element.data()['members'], timestamp: element.data()['timestamp'] });
      });
      this.privateChats.sort((a, b) => b.timestamp - a.timestamp);
      if (this.selChatRef) {
        this.setSelChatIndex(this.selChatRef);
      }
    });
  }


  /**
   * Subscribes selected chat messages, defines messages array and sorts them by time
   * 
   * @param chat - selected private chat object
   */
  getPrivateChatMessages(chat: any) {
    this.unsubPrivateChatMessages = onSnapshot(collection(this.firestore, `chats/${chat.chatId}/messages`), (listMessages) => {
      this.messages = [];
      listMessages.forEach(message => {
        this.messages.push(this.setMessageObj(message.data(), message.id));
      })
      this.messages.sort((a, b) => a.timestamp - b.timestamp);
    })
  }

  /**
   * Sets simple object based on message element data - dop
   * 
   * @param obj - single message element data
   * @param id - single message element document id
   * @returns - message object
   */
  setMessageObj(obj: any, id: string): Message {
    return {
      messageId: id,
      message: obj.message || '',
      member: obj.member,
      reactions: this.setReactions(obj) || [],
      timestamp: obj.timestamp,
      uploadedFile: obj.uploadedFile || []
    };
  }


  /**
   * Sets reactionsArray with simple reaction objects - dop
   * 
   * @param obj - array of strings
   * @returns 
   */
  setReactions(obj: any) {
    if (obj.reactions) {
      let reactionsArray = [];
      for (let i = 0; i < obj.reactions.length; i++) {
        const reactionString = obj.reactions[i];
        let reactionArray = reactionString.split('&');
        if (reactionArray.length === 2) {
          let reactionMember = reactionArray[0];
          let reactionEmoji = reactionArray[1];
          reactionsArray.push({ reactUser: reactionMember, reactEmoji: reactionEmoji })
        } else {
       
        }
      }
      return reactionsArray;
    } else {
      return [];
    }
  }


  /**
   * Adds new chat document to collection and sets variables to open private chat window with new chat
   * 
   * @param item - private chat object
   * @param colId - string, collection id f.e. 'chats'
   */
  async startNewPrivateChat(item: {}, colId: string) {
    await addDoc(collection(this.firestore, colId), item).catch(
      (err) => { console.error(err) }
    ).then(
      (docRef) => {
        if (docRef) {
          this.messages = [];
          this.newChatStarted = true;
          this.selChatIndex = 0;
          this.selChatRef = docRef.id;
          this.currentChat = this.privateChats[0];
          this.evtSvc.PrivateChatModus();
          // hier update Funktion um die ChatRef in den beiden Usern zu speichern!
        } else {
          console.error("Failed to get document reference.");
        }
      }
    )
  }


  /**
   * Adds message document to selected chat 
   * 
   * @param message - message object
   * @param chatRef - selected chat document ref
   */
  async addMessageToPrivateChat(message: {}, chatRef: string) {
    // let chatRef = this.privateChats[this.selChatIndex].chatId;
    await addDoc(collection(this.firestore, `chats/${chatRef}/messages`), message).catch(
      (err) => { console.error(err) }
    ).then(
      (docRef) => {
        if (this.newChatStarted) {
          this.getPrivateChatMessages(this.currentChat);
          this.newChatStarted = false;
        }
        // console.log("Document written with ID: ", docRef)
      }
    )
    this.privateChats[this.selChatIndex].timestamp = Date.now();
    await this.updateChat(this.privateChats[this.selChatIndex]);
  }


  /**
   * Updates private chats document, mostly because of a the new timestamp
   * 
   * @param item - selected pirvate chat object
   */
  async updateChat(item: PrivateChat) {
    if (item.chatId) {
      this.selChatRef = item.chatId;
      let docRef = doc(collection(this.firestore, 'chats'), item.chatId);
      await updateDoc(docRef, { members: item.members, timestamp: item.timestamp }).catch((err) => { console.log(err); });
    }
  }


  /**
   * Updates selected and changed message
   * 
   * @param message - selected message object
   */
  async updateMessage(message: Message) {
    let chatRef = this.privateChats[this.selChatIndex].chatId;
    if (message.messageId) {
      let docRef = doc(collection(this.firestore, `chats/${chatRef}/messages`), message.messageId);
      await updateDoc(docRef, this.toJSONmessage(message)).catch((err) => { console.log(err); });
    }
  }


  /**
   * Sets simple JSON object without id - dop
   * 
   * @param obj - message object
   * @returns 
   */
  toJSONmessage(obj: any) {
    if (obj.reactions.length > 0) {
      return {
        message: obj.message || '',
        member: obj.member,
        reactions: this.toJSONreactions(obj) || [],
        timestamp: obj.timestamp,
        uploadedFile: obj.uploadedFile || []
      }
    } else {
      return {
        message: obj.message || '',
        member: obj.member,
        timestamp: obj.timestamp,
        uploadedFile: obj.uploadedFile || []
      }
    }
  }


  /**
   * Sets reactionsArray array with reaction strings - dop
   * 
   * @param obj - message object
   * @returns 
   */
  toJSONreactions(obj: any) {
    let reactionsArray = [];
    for (let i = 0; i < obj.reactions.length; i++) {
      const reaction = obj.reactions[i];
      reactionsArray.push(reaction.reactUser + "&" + reaction.reactEmoji)
    }
    return reactionsArray;
  }


  /**
   * Checks if memberId is included in privateChats members
   * 
   * @param memberId - member document ref
   * @returns 
   */
  searchForMemberInChats(memberId: string) {
    for (let i = 0; i < this.privateChats.length; i++) {
      const chat = this.privateChats[i];
      if (chat.members.includes(memberId)) {
        return true;
      }
    }
    return false;
  }


  /**
   * Retruns index of selected members chat within privateChats
   * 
   * @param memberId - member document ref
   * @returns 
   */
  getSelChatIndex(memberId: string) {
    if (memberId !== this.authService.uid) {
      for (let i = 0; i < this.privateChats.length; i++) {
        const chat = this.privateChats[i];
        if (chat.members.includes(memberId)) {
          return i;
        }
      }
      return 0;
    } else {
      for (let i = 0; i < this.privateChats.length; i++) {
        const chat = this.privateChats[i];
        if (chat.members.length === 1) {
          return i;
        }
      }
      return 0;
    }
  }


  /**
   * Sets selChatIndex variable 
   * 
   * @param chatRef - selected chat document ref
   */
  setSelChatIndex(chatRef: string) {
    const index = this.privateChats.findIndex(chat => chat.chatId === chatRef);
    if (index !== -1) {
      this.selChatIndex = index;
    }
  }
}