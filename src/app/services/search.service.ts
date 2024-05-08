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

  startSearch(searchText: string) {
    this.foundUsers = this.searchUsers(searchText)
    this.foundChannelNames = this.searchChannelNames(searchText)
    this.foundMessages = this.searchChannelMessages(searchText)

  }

  searchUsers(searchText: string) {
    const queryText = searchText.toLowerCase();
    const foundUsers = this.userService.users.filter(user => user.name.toLowerCase().includes(queryText));
    console.log(foundUsers)
    return foundUsers;

  }

  searchChannelNames(searchText: string) {
    const queryText = searchText.toLowerCase();
    const foundChannels = this.channelService.allChannels.filter(channel => channel.name.toLowerCase().includes(queryText));
    console.log(foundChannels)
    return foundChannels;
  }

  async searchChannelMessages(searchText: string) {
    const queryText = searchText.toLowerCase();
    const currentUserID = this.authService.uid;
    const channels = this.channelService.channels;
    const foundMessages: any[] = [];

    for (const channel of channels) {
        const channelId = channel.id;
        const chatCollectionRef = collection(this.firestore, `channels/${channelId}/chats`);

        const chatQuerySnapshot = await getDocs(chatCollectionRef);
        chatQuerySnapshot.forEach(async chatDoc => {
            const chatId = chatDoc.id;
            const messageCollectionRef = collection(this.firestore, `channels/${channelId}/chats/${chatId}/messages`);

            const messageQuerySnapshot = await getDocs(messageCollectionRef);
            messageQuerySnapshot.forEach(messageDoc => {
                const messageData = messageDoc.data();
                // Hier können Sie die Nachrichten nach Ihrem Suchtext filtern
                if (messageData['message'].toLowerCase().includes(queryText)) {
                    foundMessages.push({
                        channel: channelId,
                        chat: chatId,
                        message: messageData
                    });
                }
            });
        });
    }

    console.log('Gefundene Nachrichten:', foundMessages);
    return foundMessages;
}
}






