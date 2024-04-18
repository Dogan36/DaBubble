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
      if(this.channelsOfUser) {
        //15.04 auskommentiert weil es einen fehler wirft
        this.subSglChannelChats(this.channelsOfUser[0].id);
        console.log('Test 212', this.channelsOfUser[0]);
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


// an dieser Stelle verwende ich nicht message.class sondern erstelle ein neues Objekt, daher die Fehlermeldung für setChatObj.
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
          console.log(this.authService.uid)
          let index = element.members?.indexOf(this.authService.uid);
          
          if(index !== -1) {
            this.channelsOfUser.push(element);
            
          }
        }
      }
    }
    console.log('Channels Of User are', this.channelsOfUser);
  }
  
  
  ngOnDestroy() {
    this.unsubChannels();
  }
}


