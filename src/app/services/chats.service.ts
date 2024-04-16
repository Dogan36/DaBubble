import { Injectable, inject } from '@angular/core';
import { Firestore, onSnapshot, collection, addDoc, doc, updateDoc, deleteDoc, query, where } from '@angular/fire/firestore';
import { Channel } from '../models/channel.class';
import { AuthService } from './auth.service';
import { Message } from '../models/message.class';


@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  firestore: Firestore = inject(Firestore);

  chats: Message[] = [];

  chatsChannel: Message[] = []; 
  chatsPrivat: Message[] = [];


  // unsubChannelChatsList;
  unsubSglChannelChat: any;



  constructor(private authService: AuthService) {
    // this.unsubChannelChatsList = this.subChannelChatsList();

  }







// Dieser Service ist nur zum testen und für Notizen. Wird am Ende gelöscht!!!!///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////











  

  // Nur die Chats subscriben, die für den user relevant sind. Filter einsetzen

  // subChannelChatsList() {
  //   const q = query(collection(this.firestore, 'channelChats'),where('members', 'array-contains', uid));
  //   return onSnapshot(q, (list) => {
  //     // this.chats = [];
  //     list.forEach(element => {
  //       // this.chats.push(this.setChatObject(element.data(), element.id),);
  //       // this.subSglChannelChat(element.id)
  //     })
  //   });
  // }


  // Mit der docRef komme ich an mein chat und dessen Messages! Jeder einzelne Chat muss jetzt mit der jeweiligen chatRef subscribed werden

  subSglChannelChat() {
    console.log('Test 404');
    // return onSnapshot(collection(this.firestore, `channelChats/${chatRef}/messages`), (list) => {
      // this.chats = [];
      // list.forEach(element => {
      //   this.channels.push(this.setChannelObject(element.data(), element.id),);
    //   })
    // };
    }


// Test !!!!
  // subSglChannelChats(channelRef:string) {
  //   onSnapshot(collection(this.firestore, `channels/${channelRef}/chats`), (listChats) => {
  //     this.selectedChannelChats = [];

  //     listChats.forEach(chat => {
  //       let messages = [];

  //       onSnapshot(collection(this.firestore, `channels/${channelRef}/chats/${chat.id}/messages`), (listMessages) => {

  //         listMessages.forEach(message => {
  //           messages.push(this.setMessageObj(message.data(), message.id));
  //         })

  //       })

  //       this.selectedChannelChats.push(this.setChatObj(messages, chat.id));
  //     })
  //   })
  // }


  // setChatObject(obj:any, id: string) {
  //   return {
  //     id: id,
  //     name: obj.name,
  //     creator: obj.creator,
  //     members: obj.members || '',
  //     threads: obj.threads || '',
  //     description: obj.description || ''
  //   };
  // }


  // async startNewChat(item: {}, message: {}) {

  //   await addDoc(collection(this.firestore, 'chats'), item).catch(
  //       (err) => { console.error(err) }
  //     ).then(
  //       (docRef) => { console.log("Document written with ID: ", docRef),
  //       this.addMessageToChat(message, docRef);
  //       } // docSubRef noch mal in dem message Object als id speichern
  //     ) 
  // }



  // async addMessageToChat(message: {}, chatRef: string) {

  //   await addDoc(collection(this.firestore, `chats/${chatRef}/messages`), message).catch(
  //       (err) => { console.error(err) }
  //     ).then(
  //     (docRef) => { console.log("Document written with ID: ", docRef)} // docRef noch mal in dem message Object als id speichern!
  //     ) 
  // }


  
  // async updateMessage(message: {}, chatRef) {
  //   if(message.id) {
  //     let docRef = doc(collection(this.firestore, `chats/${chatRef}/messages`), message.id);
  //     await updateDoc(docRef, this.toJSON(message)).catch((err) => { console.log(err); });
  //   }
  // }
  
  
  // toJSON(obj:any) {
    // return {
        // name: obj.name,
        // creator: obj.creator,
        // members: obj.members,
        // threads: obj.threads || [''],
        // description: obj.description || ''
    // };
  // }


  // async deleteNote(docId: string) {
  //   let docRef = doc(collection(this.firestore, 'channels'), docId);
  //   await deleteDoc(docRef).catch(
  //     (err) => {console.log(err)}
  //   )
  // }


  ngOnDestroy() {
    // this.unsubChatsList();
   // this.unsubSglChannelChat();
  }
}
