import { Injectable, inject } from '@angular/core';
import { Firestore, onSnapshot, collection, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Channel } from '../models/channel.class';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  firestore: Firestore = inject(Firestore);

  selectedChannel: number = 0;
  channels: Channel[] = [];

  unsubChannels;

  constructor(private authService: AuthService) {
    this.unsubChannels = this.subChannelsList();
   }

  
  // ngAfterViewInit() {
  //   this.filterChannelsOfUser();
  // }

  //  filterChannelsOfUser() {
  //   if(this.channels) {
  //     let channelsOfUser = [];
  //     for (let i = 0; i < this.channels.length; i++) {
  //       const element = this.channels[i];
  
  //       if(this.authService.currentUser?.uid) {
  //       let index = element.members?.indexOf(this.authService.currentUser?.uid)
        
  //       if(index) {
  //         channelsOfUser.push(element);
  
  //         console.log('Channels Of User are', channelsOfUser);
  //       }
  //     }
  //     }
  //   }
  //  }


  subChannelsList() {
    return onSnapshot(collection(this.firestore, 'channels'), (list) => {
      this.channels = [];
      list.forEach(element => {
        this.channels.push(this.setChannelObject(element.data(), element.id),);
      })
      console.log('Channels are', this.channels);
    });
    }


  setChannelObject(obj:any, id: string) {
    return {
      id: id,
      name: obj.name,
      creator: obj.creator,
      members: obj.members || '',
      threads: obj.threads || '',
      description: obj.description || ''
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
        threads: obj.threads || [''],
        description: obj.description || ''
    };
  }


  async deleteNote(docId: string) {
    let docRef = doc(collection(this.firestore, 'channels'), docId);
    await deleteDoc(docRef).catch(
      (err) => {console.log(err)}
    )
  }


  ngonDestroy() {
    this.unsubChannels();
  }
}

