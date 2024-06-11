import { Injectable, inject } from '@angular/core';
import { UserService } from './user.service';
import { Firestore, collection, getDocs, query, where } from '@angular/fire/firestore';
import { ChannelService } from './channel.service';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor() {
  }
  private userService: UserService = inject(UserService)
  private firestore: Firestore = inject(Firestore);
  private channelService: ChannelService = inject(ChannelService)
  private authService: AuthService = inject(AuthService)
  foundUsers: any = []
  foundChannelNames: any = []
  foundMessages: any = []
  private channelListLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * This function starts the search
   * 
   * @param searchText {String} This is the text the user has entered
   */
  async startSearch(searchText: string) {
    this.foundUsers = this.searchUsers(searchText)
    this.foundChannelNames = this.searchChannelNames(searchText)
    this.foundMessages = await this.searchChannelMessages(searchText)
  }

  /**
   * This function searches users 
   * @param searchText {String} This is the text the user has entered
   * @returns the users that has been found
   */
  searchUsers(searchText: string) {
    const queryText = searchText.toLowerCase();
    const foundUsers = this.userService.users.filter(user => user.name.toLowerCase().includes(queryText));
    // console.log(foundUsers)
    return foundUsers;
  }

  /**
   * This function searches channels 
   * @param searchText {String} This is the text the user has entered
   * @returns the channels that has been found
   */
  searchChannelNames(searchText: string) {
    const queryText = searchText.toLowerCase();
    const foundChannels = this.channelService.channels.filter(channel => channel.name.toLowerCase().includes(queryText));
    // console.log(foundChannels)
    return foundChannels;
  }

  /**
   * This function searches messages inside channels
   * @param searchText {String} This is the text the user has entered
   * @returns the messages that has been found
   */
  async searchChannelMessages(searchText: string) {
    const queryText = searchText.toLowerCase();
    const currentUserID = this.authService.uid;
    const channels = this.channelService.channels;
    const foundMessages: any[] = [];
    const promises = channels.map(async channel => {
      const channelId = channel.id;
      const chatCollectionRef = collection(this.firestore, `channels/${channelId}/chats`);
      const chatQuerySnapshot = await getDocs(chatCollectionRef);
      const chatPromises = chatQuerySnapshot.docs.map(async chatDoc => {
        const chatId = chatDoc.id;
        const messageCollectionRef = collection(this.firestore, `channels/${channelId}/chats/${chatId}/messages`);
        const messageQuerySnapshot = await getDocs(messageCollectionRef);
        messageQuerySnapshot.forEach(messageDoc => {
          const messageData = messageDoc.data();
          if (messageData['message'].toLowerCase().includes(queryText)) {
            foundMessages.push({
              channel: channelId,
              chat: chatId,
              message: messageData
            });
          }
        });
      });
      await Promise.all(chatPromises);
    });
    await Promise.all(promises);
    return foundMessages;
  }

  /**
   * This function returns the message
   * @param message {String} this ist the message
   * @returns message or message.message
   */
  getMessageText(message: any): string {
    if (typeof message === 'string') {
      // Wenn die Nachricht bereits eine Zeichenkette ist, gib sie direkt zurück
      return message;
    } else if (message && message.hasOwnProperty('message')) {
      // Wenn die Nachricht ein Objekt ist und die 'message'-Eigenschaft hat, gib den Wert dieser Eigenschaft zurück
      return message.message;
    } else {
      // Andernfalls gib einfach eine leere Zeichenkette zurück oder eine Meldung, dass der Nachrichtentyp nicht unterstützt wird
      return '';
    }
  }
}