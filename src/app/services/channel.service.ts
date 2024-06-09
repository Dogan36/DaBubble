import { Injectable, inject } from '@angular/core';
import { Firestore, onSnapshot, collection, addDoc, doc, updateDoc, deleteDoc, query, where, getDocs } from '@angular/fire/firestore';
import { Channel } from '../models/channel.class';
import { AuthService } from './auth.service';
import { Message } from '../models/message.class';
import { Chat } from '../models/chat.class';
import { UserService } from './user.service';
import { Subscription } from 'rxjs';

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
  newAddedChannelRef = "";
  unsubChannels;
  unsubSglChannelChats!: Function;
  private userSubscription: Subscription;


  constructor(private authService: AuthService) {
    this.authService.logoutEvent.subscribe(() => {
      this.clearChannels();
    });
    // this.authService.getCurrentUser().subscribe(user => {
    //   if (user) {
    //     this.uid = user.uid;
    //   }
    // });
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      if (this.unsubChannels) {
        this.unsubChannels();
      }
      if (user) {
        this.unsubChannels = this.subChannelsList();
      }
    });

    this.authService.generateOwnChatEvent.subscribe(() => {
      if (this.authService.joinStartingChannelsEventEmitted == false) {
        this.joinStartingChannels();
        this.authService.joinStartingChannelsEventEmitted = true
      }
    });
    this.unsubChannels = this.subChannelsList();
  }

  
  /**
   * Variables are set to empty or -1
   */
  clearChannels() {
    this.allChannels = [];
    this.channels = [];
    this.selectedChannel = -1
    this.selectedChannelChats = [];
  }


  /**
   * Subscribes collection and sets allChannels and calls filterChannelsOfUser function. Than subSglChannelChats is called
   * 
   * @returns 
   */
  subChannelsList() {
    // const q = query(collection(this.firestore, 'channels'), where('members', 'array-contains', this.uid));
    return onSnapshot(collection(this.firestore, 'channels'), (list) => {
      this.allChannels = [];
      this.channels = [];
      list.forEach(element => {
        this.allChannels.push(this.setChannelObject(element.data(), element.id),);
      })
      this.filterChannelsOfUser();
      if (this.channels.length !== 0) {
        this.subSglChannelChats(this.channels[0].id);
      }
    });
  }


  /**
   * Creates simple object with element data
   * 
   * @param obj - single channel element data
   * @param id - single channel element document ref
   * @returns - channel object
   */
  setChannelObject(obj: any, id: string) {
    return {
      id: id,
      name: obj.name,
      creator: obj.creator,
      members: obj.members || '',
      description: obj.description || ''
    };
  }


  /**
   * Subscribes single channel chats and defines selectedChannelChats array at the end selChatIndex is defined if chatRef isn't 'false'
   * 
   * @param channelRef - single channel document ref
   * @param chatRef - default parameter as a string
   */
  subSglChannelChats(channelRef: string, chatRef = 'false') {
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
          if (index == -1) {
            this.selectedChannelChats.push(this.setChatObj(this.colMessages, chat.id, chat.data()['timestamp']));
          } else {
            this.selectedChannelChats.splice(index, 1, this.setChatObj(this.colMessages, chat.id, chat.data()['timestamp']));
          }
          this.selectedChannelChats.sort((a, b) => a.timestamp - b.timestamp);
          if (chatRef !== 'false') {
            const index = this.selectedChannelChats.findIndex(chat => chat.chatId == chatRef);
            if (index !== -1)
              this.selChatIndex = index;
          }
        })
      });
    })
  }


  /**
   * Sets simple object based on message element data
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
   * Sets simple object based on send parameters
   * 
   * @param colMessages - array of message objects
   * @param id - single chat document id
   * @param timestamp 
   * @returns 
   */
  setChatObj(colMessages: Message[], id: string, timestamp: number): Chat {
    return {
      chatId: id,
      timestamp: timestamp,
      allMessages: colMessages,
    };
  }


  /**
   * Sets reactionsArray with simple reaction objects
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
   * Checks if name is already used as a name for a channel in array of channels
   * 
   * @param name - string, name of channel
   * @returns 
   */
  async isChannelNameTaken(name: string): Promise<boolean> {
    const q = query(collection(this.firestore, 'channels'), where('name', '==', name));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }


  /**
   * Adds object to collection and creats new document
   * 
   * @param item - channel object
   * @param colId - string, default parameter
   */
  async addChannel(item: {}, colId: "channels") {
    await addDoc(collection(this.firestore, colId), item).catch(
      (err) => { console.error(err) }
    ).then(
      (docRef) => {
        if (docRef) {
          this.newAddedChannelRef = docRef.id;
        } else {
          console.error("Failed to get document reference.");
        }
      }
    );
  }


  /**
   * Adds item object to selected channel document and calls addMessageToChat function
   * 
   * @param item - chat object
   * @param message - message object
   */
  async startNewChat(item: {}, message: {}) {
    let channelRef = this.channels[this.selectedChannel].id;
    await addDoc(collection(this.firestore, `channels/${channelRef}/chats`), item).catch(
      (err) => { console.error(err) }
    ).then(
      (docRef) => {
        if (docRef) {
          this.addMessageToChat(message, docRef.id);
        } else {
          console.error("Failed to get document reference.");
        }
      }
    )
  }

  
  /**
   * Adds message object to selected chat document
   * 
   * @param message - message object
   * @param chatRef - selected chat document ref
   */
  async addMessageToChat(message: {}, chatRef: string) {
    let channelRef = this.channels[this.selectedChannel].id;
    await addDoc(collection(this.firestore, `channels/${channelRef}/chats/${chatRef}/messages`), message).catch(
      (err) => { console.error(err) }
    );
  }


  /**
   * Updates channel object 
   * 
   * @param item - selected channel object
   */
  async updateChannel(item: Channel) {
    if (item.id) {
      let docRef = doc(collection(this.firestore, 'channels'), item.id);
      await updateDoc(docRef, this.toJSON(item)).catch((err) => { console.log(err); });
    }
  }

  /**
   * Sets simple JSON object without id
   * 
   * @param obj - channel object
   * @returns 
   */
  toJSON(obj: any) {
    return {
      name: obj.name,
      creator: obj.creator,
      members: obj.members,
      description: obj.description || ''
    };
  }


  /**
   * Updates message object 
   * 
   * @param message - selected message object
   */
  async updateMessage(message: Message) {
    let channelRef = this.channels[this.selectedChannel].id;
    let chatRef = this.selectedChannelChats[this.selChatIndex].chatId;
    if (message.messageId) {
      let docRef = doc(collection(this.firestore, `channels/${channelRef}/chats/${chatRef}/messages`), message.messageId);
      await updateDoc(docRef, this.toJSONmessage(message)).catch((err) => { console.log(err); });
    }
  }

  /**
   * Sets simple JSON object without id
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
   * Sets reactionsArray array with reaction strings
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
   * Deletes channel form collection
   * 
   * @param docId - channel document ref
   */
  async deleteChannel(docId: string) {
    let docRef = doc(collection(this.firestore, 'channels'), docId);
    await deleteDoc(docRef).catch(
      (err) => { console.log(err) }
    )
  }


  /**
   * Filters channels of signed in user
   */
  filterChannelsOfUser() {
    if (this.allChannels) {
      for (let i = 0; i < this.allChannels.length; i++) {
        const element = this.allChannels[i];
        if (this.authService.uid) {
          let index = element.members?.indexOf(this.authService.uid);
          if (index !== -1) {
            this.channels.push(element);
          }
        }
      }
      this.channels.sort(function (a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    }
  }


  /**
   * Sets index of selected channel based on its channelRef
   * 
   * @param channelRef - selected channels document ref
   */
  setSelectedChannelIndex(channelRef: string) {
    const index = this.channels.findIndex(channel => channel.id === channelRef);
    if (index !== -1) {
      this.selectedChannel = index;
    }
  }


  /**
   * Sets formattedTime based on timestamp
   * 
   * @param timestamp 
   * @returns 
   */
  getTime(timestamp: number) {
    const date = new Date(timestamp);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const formattedTime = `${hours}:${minutes}`;
    return formattedTime;
  }


  /**
   * Sets formattedDate based on timestamp
   * 
   * @param timestamp 
   * @returns 
   */
  getDate(timestamp: number) {
    const date = new Date(timestamp);
    const daysOfWeek = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    const dayOfWeek = daysOfWeek[date.getDay()];
    const dayOfMonth = date.getDate();
    const monthName = months[date.getMonth()];
    const formattedDate = `${dayOfWeek}, ${dayOfMonth} ${monthName}`;
    return formattedDate;
  }


  /**
   * Checks if timestamp is identical with todays date or not
   * 
   * @param timestamp 
   * @returns - boolean
   */
  isToday(timestamp: number): boolean {
    const today = new Date();
    const dateFromTimestamp = new Date(timestamp);
    return (
      today.getFullYear() === dateFromTimestamp.getFullYear() &&
      today.getMonth() === dateFromTimestamp.getMonth() &&
      today.getDate() === dateFromTimestamp.getDate()
    );
  }


  /**
   *  Unsubscribes subscriptions
   */
  ngOnDestroy() {
    this.unsubChannels();
    this.authService.joinStartingChannelsEventEmitted = false
    if (this.unsubSglChannelChats) {
      this.unsubSglChannelChats();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }


  /**
   * Checks if single reaction.reactEmoji is already included in sortedReaction.reactEmoji and adds reaction if not or adds reactUser if yes
   * 
   * @param reactions - array of reaction objects
   * @returns 
   */
  sortSameReactions(reactions: { reactUser: string, reactEmoji: string }[]) {
    const sortedReactions: { reactUser: string[], reactEmoji: string }[] = [];
    reactions.forEach(reaction => {
      if (sortedReactions.length > 0) {
        const index = sortedReactions.findIndex(sortedReaction =>
      sortedReaction.reactEmoji === reaction.reactEmoji);
        if (index === -1) {
          sortedReactions.push({ reactUser: [reaction.reactUser], reactEmoji: reaction.reactEmoji });
        } else {
          sortedReactions[index].reactUser.push(reaction.reactUser);
        }
      } else {
        sortedReactions.push({ reactUser: [reaction.reactUser], reactEmoji: reaction.reactEmoji });
      }
    });
    return sortedReactions;
  }


  /**
   * Checks index of all three documents and adds new user to these channels
   */
  joinStartingChannels() {
    const indexE = this.allChannels.findIndex(channel => channel.id === 'AdmWvjOG986xrhB0qWUP');
    const indexA = this.allChannels.findIndex(channel => channel.id === 'CyYgkUT5csUtrJ88cBCv');
    const indexO = this.allChannels.findIndex(channel => channel.id === 'wD8QfT5LVsfatMkctXgN');
    if (indexE !== -1) {
      const channel: Channel = this.allChannels[indexE];
      channel.members.push(this.authService.uid);
      this.updateChannel(channel);
    }
    if (indexA !== -1) {
      const channel: Channel = this.allChannels[indexA];
      channel.members.push(this.authService.uid);
      this.updateChannel(channel);
    }
    if (indexO !== -1) {
      const channel: Channel = this.allChannels[indexO];
      channel.members.push(this.authService.uid);
      this.updateChannel(channel);
    }
  }
}

// AdmWvjOG986xrhB0qWUP - Entwicklerteam

// CyYgkUT5csUtrJ88cBCv - Allgemein

// wD8QfT5LVsfatMkctXgN - Office-team


