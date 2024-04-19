import { Injectable, inject } from '@angular/core';
import { Firestore, onSnapshot, collection, addDoc, doc, updateDoc, deleteDoc, query, where } from '@angular/fire/firestore';
import { Channel } from '../models/channel.class';
import { AuthService } from './auth.service';
// import { ChatsService } from './chats.service';
import { Message } from '../models/message.class';
import { Chat } from '../models/chat.class';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  firestore: Firestore = inject(Firestore);

  selectedChannel: number = 0;
  channels: Channel[] = [];
  channelsOfUser: Channel[] = [];
  selectedChannelChats: Chat[] = [];
  selChatIndex: number = 0;
  colMessages: Message[] = [];

  unsubChannels;

  constructor(private authService: AuthService) {
    // this.authService.getCurrentUser().subscribe(user => {
    //   if (user) {
    //     this.uid = user.uid;
    //   }
    // });
    this.unsubChannels = this.subChannelsList();
  }

  
  
  // Im Moment wird this.filterChannelsOfUser(); jedes mal aufgerufen wenn sich Daten ändern. Daher eher ungünstig in der subChannelsList() function
  subChannelsList() {
    // const q = query(collection(this.firestore, 'channels'), where('members', 'array-contains', this.uid));
    return onSnapshot(collection(this.firestore, 'channels'), (list) => {
      this.channels = [];
      this.channelsOfUser = [];
      list.forEach(element => {
        this.channels.push(this.setChannelObject(element.data(), element.id),);
      })

      // Besser wo anders aufrufen!
      this.filterChannelsOfUser(); 
      if(this.channelsOfUser.length !== 0 ) {

        //15.04 auskommentiert weil es einen fehler wirft
        this.subSglChannelChats(this.channelsOfUser[0].id);

      }
    });
    }


  setChannelObject(obj:any, id: string) {
    return {
      id: id,
      name: obj.name,
      creator: obj.creator,
      members: obj.members || '',
      // threads: obj.threads || '',
      description: obj.description || ''
    };
  }


  subSglChannelChats(channelRef:string) {
    this.selectedChannelChats = [];
    onSnapshot(collection(this.firestore, `channels/${channelRef}/chats`), (listChats) => {
      
      listChats.forEach(chat => {
        
        onSnapshot(collection(this.firestore, `channels/${channelRef}/chats/${chat.id}/messages`), (listMessages) => {
          this.colMessages = [];

          listMessages.forEach(message => {
            this.colMessages.push(this.setMessageObj(message.data(), message.id));
          })
          const index = this.selectedChannelChats.findIndex(chatObj => chatObj.chatId === chat.id);
          if(index == -1) {
            this.selectedChannelChats.push(this.setChatObj(this.colMessages, chat.id));
          } else {
            this.selectedChannelChats.splice(index, 1, this.setChatObj(this.colMessages, chat.id));
          }
          console.log('Test002', this.selectedChannelChats);
        })
      })
    })
    console.log('Test 003', this.selectedChannelChats);
  }


  setMessageObj(obj:any, id:string): Message { 
    return {
      messageId: id,
      message: obj.message || '',
      member: obj.member,
      timestamp: obj.timestamp
    };
  }

  setChatObj(colMessages:Message[], id:string) : Chat {
    return {
      chatId: id,
      allMessages: colMessages,
    };
  }



  async addChannel(item: {}, colId: "channels") {
    console.log('Test um zu schauen was alles in item drin ist', item)
    await addDoc(collection(this.firestore, colId), item).catch(
        (err) => { console.error(err) }
      ).then(
      (docRef) => { console.log("Document written with ID: ", docRef)}
      ) 
  }


  // saves new chat
  // async startNewChat(item: {}, message: {}, channelRef:string) {
  //   await addDoc(collection(this.firestore, `channels/${channelRef}/chats`), item).catch(
  //       (err) => { console.error(err) }
  //     ).then(
  //       (docRef) => { console.log("Document written with ID: ", docRef),
  //       this.addMessageToChat(message, channelRef, docRef);
  //       } // docSubRef noch mal in dem message Object als id speichern?? 
  //     ) 
  // }


  // saves new message in chat
  async addMessageToChat(message: {}, channelRef:string, chatRef: string) {
    await addDoc(collection(this.firestore, `channels/${channelRef}/chats/${chatRef}/messages`), message).catch(
        (err) => { console.error(err) }
      ).then(
      (docRef) => { console.log("Document written with ID: ", docRef)} // docRef noch mal in dem message Object als id speichern!
      ) 
  }

  
  async updateChannel(item: Channel) {
    if(item.id) {
      let docRef = doc(collection(this.firestore, 'channels'), item.id);
      await updateDoc(docRef, this.toJSON(item)).catch((err) => { console.log(err); });
    }
  }
  
  
  toJSON(obj:any) {
    return {
        name: obj.name,
        creator: obj.creator,
        members: obj.members,
        // threads: obj.threads || [''],
        description: obj.description || ''
    };
  }


  // async updateMessage(message: {}, channelRef:string, chatRef:string) {
  //   if(message.id) {
  //     let docRef = doc(collection(this.firestore, `channels/${channelRef}/chats/${chatRef}/messages`), message.id);
  //     await updateDoc(docRef, this.toJSONmessage(message)).catch((err) => { console.log(err); });
  //   }
  // }
  
  
  toJSONmessage(obj:any) {
    return {
        message: obj.message || '',
        member: obj.member,
        timestamp: obj.timestamp
    };
  }



  async deleteNote(docId: string) {
    let docRef = doc(collection(this.firestore, 'channels'), docId);
    await deleteDoc(docRef).catch(
      (err) => {console.log(err)}
    )
  }

  
  filterChannelsOfUser() {
    if(this.channels) {
      for (let i = 0; i < this.channels.length; i++) {
        const element = this.channels[i];
        
        if(this.authService.uid) {
          let index = element.members?.indexOf(this.authService.uid);
          
          if(index !== -1) {
            this.channelsOfUser.push(element);
            
          }
        }
      }
    }

  }
  
  
  ngOnDestroy() {
    this.unsubChannels();
  }
}


