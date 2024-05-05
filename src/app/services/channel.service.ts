import { Injectable, inject } from '@angular/core';
import { Firestore, onSnapshot, collection, addDoc, doc, updateDoc, deleteDoc, query, where } from '@angular/fire/firestore';
import { Channel } from '../models/channel.class';
import { AuthService } from './auth.service';
import { Message } from '../models/message.class';
import { Chat } from '../models/chat.class';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})

export class ChannelService {

  firestore: Firestore = inject(Firestore);

  allChannels: Channel[] = []; // all existing channels
  
  channels: Channel[] = []; // filtered channels of user
  selectedChannel: number = 0; // selected channel on the board (index)

  selectedChannelChats: Chat[] = []; // all chats of selected channel
  selChatIndex: number = 0; // selected chat of all chats (index)
  
  colMessages: Message[] = []; // var to store all msg of one chat while subscribing the channel with its chats

  unsubChannels;
  private unsubSglChannelChats!: Function;

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

      this.allChannels = [];
      this.channels = [];
  
      list.forEach(element => {
        this.allChannels.push(this.setChannelObject(element.data(), element.id),);
      })

      // Besser wo anders aufrufen!
      this.filterChannelsOfUser(); 
      if(this.channels.length !== 0 ) {
        this.subSglChannelChats(this.channels[0].id);
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
    this.unsubSglChannelChats = onSnapshot(collection(this.firestore, `channels/${channelRef}/chats`), (listChats) => {
      
      listChats.forEach(chat => {
        
        onSnapshot(collection(this.firestore, `channels/${channelRef}/chats/${chat.id}/messages`), (listMessages) => {
          this.colMessages = [];

          listMessages.forEach(message => {
            this.colMessages.push(this.setMessageObj(message.data(), message.id));
          })
          // sorts the array of messages by the timestamp!
          this.colMessages.sort((a, b) => a.timestamp - b.timestamp);

          const index = this.selectedChannelChats.findIndex(chatObj => chatObj.chatId === chat.id);
          if(index == -1) {
            this.selectedChannelChats.push(this.setChatObj(this.colMessages, chat.id, chat.data()['timestamp']));
          } else {
            this.selectedChannelChats.splice(index, 1, this.setChatObj(this.colMessages, chat.id, chat.data()['timestamp']));
          }
          this.selectedChannelChats.sort((a, b) => a.timestamp - b.timestamp);
        })
      })
    })
  }


  setMessageObj(obj:any, id:string): Message { 
    return {
      messageId: id,
      message: obj.message || '',
      member: obj.member,
      reactions: this.setReactions(obj) || [],
      timestamp: obj.timestamp,
      uploadedFile: obj.uploadedFile || []
    };
  }

  setChatObj(colMessages:Message[], id:string, timestamp: number) : Chat {
    return {
      chatId: id,
      timestamp: timestamp,
      allMessages: colMessages,
    };
  }

  setReactions(obj:any) {
    if(obj.reactions) {
    let reactionsArray = [];
    for (let i = 0; i < obj.reactions.length; i++) {
      const reactionString = obj.reactions[i];
      
      let reactionArray = reactionString.split('&');

      if (reactionArray.length === 2) {
        let reactionMember = reactionArray[0];
        let reactionEmoji = reactionArray[1];

        reactionsArray.push({reactUser: reactionMember, reactEmoji: reactionEmoji})
      } else {
        console.log("Der Eingabestring hat nicht das erwartete Format.");
      }
    }
    return reactionsArray;
    } else {
      return [];
    }
  }



  async addChannel(item: {}, colId: "channels") {
    await addDoc(collection(this.firestore, colId), item).catch(
        (err) => { console.error(err) }
      ).then(
      (docRef) => { console.log("Document written with ID: ", docRef)}
      ) 
  }


  // saves new chat
  async startNewChat(item: {}, message: {}) {
    let channelRef = this.channels[this.selectedChannel].id;
    await addDoc(collection(this.firestore, `channels/${channelRef}/chats`), item).catch(
        (err) => { console.error(err) }
      ).then(
        (docRef) => { 
          if (docRef) {
            console.log("Document written with ID: ", docRef);
            this.addMessageToChat(message, docRef.id);
          } else {
            console.error("Failed to get document reference.");
          }
        } 
      ) 
  }


  // saves new message in chat
  async addMessageToChat(message: {}, chatRef:string) {
    let channelRef = this.channels[this.selectedChannel].id;

    await addDoc(collection(this.firestore, `channels/${channelRef}/chats/${chatRef}/messages`), message).catch(
        (err) => { console.error(err) }
      ).then(
      (docRef) => { 
        // console.log("Document written with ID: ", docRef)
        console.log('So sieht die Message aus', message);
      }
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
        description: obj.description || '',
        uploadedFiles: obj.uploadedFiles
    };
  }


  async updateMessage(message: Message) {
    let channelRef = this.channels[this.selectedChannel].id;
    let chatRef = this.selectedChannelChats[this.selChatIndex].chatId;

    if(message.messageId) {
      let docRef = doc(collection(this.firestore, `channels/${channelRef}/chats/${chatRef}/messages`), message.messageId);
      await updateDoc(docRef, this.toJSONmessage(message)).catch((err) => { console.log(err); });
    }
  }
  
  
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


  toJSONreactions(obj:any) {
    let reactionsArray = [];
    for (let i = 0; i < obj.reactions.length; i++) {
      const reaction = obj.reactions[i];

      reactionsArray.push(reaction.reactUser + "&" + reaction.reactEmoji)
    }
    return reactionsArray;
  }


// In der user stroy eigentlich nicht vorgesehen
  async deleteChannel(docId: string) {
    let docRef = doc(collection(this.firestore, 'channels'), docId);
    await deleteDoc(docRef).catch(
      (err) => {console.log(err)}
    )
  }

  
  filterChannelsOfUser() {
    if(this.allChannels) {
      for (let i = 0; i < this.allChannels.length; i++) {
        const element = this.allChannels[i];
        
        if(this.authService.uid) {
          let index = element.members?.indexOf(this.authService.uid);
          
          if(index !== -1) {
            this.channels.push(element);
          }
        }
      }
    }
  }


  setSelectedChannelIndex(channelRef: string) {
    const index = this.channels.findIndex(channel => channel.id === channelRef);
    console.log('Index of selectedChannel', index);

    if (index !== -1) {
      this.selectedChannel = index;
    }
  }


  getTime(timestamp:number) {
    const date = new Date(timestamp);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const formattedTime = `${hours}:${minutes}`;

    return formattedTime;
  }

  getDate(timestamp:number) {
    const date = new Date(timestamp);

    const daysOfWeek = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

    const dayOfWeek = daysOfWeek[date.getDay()];
    const dayOfMonth = date.getDate();
    const monthName = months[date.getMonth()];

    const formattedDate = `${dayOfWeek}, ${dayOfMonth} ${monthName}`;
    return formattedDate;
  }

  isToday(timestamp: number): boolean {
    const today = new Date();
    const dateFromTimestamp = new Date(timestamp);
    
    return (
        today.getFullYear() === dateFromTimestamp.getFullYear() &&
        today.getMonth() === dateFromTimestamp.getMonth() &&
        today.getDate() === dateFromTimestamp.getDate()
    );
}
  
  
  ngOnDestroy() {
    this.unsubChannels();

    if (this.unsubSglChannelChats) {
        this.unsubSglChannelChats();
    }
  }



    sortSameReactions(reactions: { reactUser: string, reactEmoji: string }[]) {
    const sortedReactions: {reactUser: string[], reactEmoji: string}[] = [];

    reactions.forEach(reaction => {

      if(sortedReactions.length > 0) {
        const index = sortedReactions.findIndex(sortedReaction =>
          sortedReaction.reactEmoji === reaction.reactEmoji);

        if(index === -1) {
          sortedReactions.push({ reactUser: [reaction.reactUser], reactEmoji: reaction.reactEmoji});
        } else {
          sortedReactions[index].reactUser.push(reaction.reactUser);
        }

      } else {
          sortedReactions.push({ reactUser: [reaction.reactUser], reactEmoji: reaction.reactEmoji});
      }
    });
      return sortedReactions;
  }
}




  // toJSONmessage(obj:any) {
  //   if(obj.reactions.length > 0 && obj.uploadedFile) {
  //     return {
  //       message: obj.message || '',
  //       member: obj.member,
  //       reactions: this.toJSONreactions(obj) || [],
  //       timestamp: obj.timestamp,
  //       uploadedFile: obj.uploadedFile || []
  //   }} else if(obj.reactions.length > 0 && obj.uploadedFile.length === 0) {
  //     return {
  //       message: obj.message || '',
  //       member: obj.member,
  //       reactions: this.toJSONreactions(obj) || [],
  //       timestamp: obj.timestamp,
  //   }} else if(obj.reactions.length === 0 && obj.uploadedFile.length > 0) {
  //     return {
  //       message: obj.message || '',
  //       member: obj.member,
  //       timestamp: obj.timestamp,
  //       uploadedFile: obj.uploadedFile || []
  //   }} else {
  //     return {
  //       message: obj.message || '',
  //       member: obj.member,
  //       timestamp: obj.timestamp,
  //     }
  //   }
  // }