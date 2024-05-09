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

  async startSearch(searchText: string) {
    this.foundUsers = this.searchUsers(searchText)
    this.foundChannelNames = this.searchChannelNames(searchText)
    this.foundMessages = await this.searchChannelMessages(searchText)
console.log(this.foundMessages)
  }

  searchUsers(searchText: string) {
    const queryText = searchText.toLowerCase();
    const foundUsers = this.userService.users.filter(user => user.name.toLowerCase().includes(queryText));
    console.log(foundUsers)
    return foundUsers;

  }

  searchChannelNames(searchText: string) {
    const queryText = searchText.toLowerCase();
    const foundChannels = this.channelService.channels.filter(channel => channel.name.toLowerCase().includes(queryText));
    console.log(foundChannels)
    return foundChannels;
  }

  async searchChannelMessages(searchText: string) {
  const queryText = searchText.toLowerCase();
  const channels = this.channelService.channels;
  const foundMessages: any[] = [];

  // Erstelle eine einzige Firestore-Abfrage, um Nachrichten aller Kanäle zu filtern
  const queryPromises = channels.map(async channel => {
    const channelId = channel.id;
    const messageCollectionRef = collection(this.firestore, `channels/${channelId}/messages`);
    const messageQuerySnapshot = await getDocs(query(messageCollectionRef, where('message', '>=', queryText)));

    messageQuerySnapshot.forEach(messageDoc => {
      const messageData = messageDoc.data();
      if (messageData['message'].toLowerCase().includes(queryText)) {
        foundMessages.push({
          channel: channelId,
          message: messageData
        });
      }
    });
  });

  await Promise.all(queryPromises); // Warte auf Abschluss aller Abfragen

  return foundMessages;
}

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






