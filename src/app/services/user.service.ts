import { Injectable, inject } from '@angular/core';
import { Firestore, onSnapshot, collection, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { User } from '../models/user.class';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  firestore: Firestore = inject(Firestore);

  users: User[] = [];
  usersName: string[] = [];
  selectedUser: number = 0;
  currentUserData: User | undefined;
  unsubUsers;
  //unsubCurrentUser;


  constructor(private authService: AuthService) {
    this.unsubUsers = this.subUsersList();
    // this.unsubCurrentUser = this.subCurrentUser();
  }


  /**
   * Subscribes users collection and defines users array with user objects
   * 
   * @returns 
   */
  subUsersList() {
    return onSnapshot(collection(this.firestore, 'users'), (list) => {
      this.users = [];
      this.usersName = [];
      list.forEach(element => {
        this.users.push(this.setUserObject(element.data(), element.id),);
        this.usersName.push(element.data()['name']);
      })
      this.filterCurrentUser();
    });
  }

  
  handleImageError(member: any) {
    this.users[this.getUsersData(member)].photoURL = this.authService.photoURL;
  }

  /*subCurrentUser() {
    console.log(this.authService.currentUser?.uid);
    if (this.authService.currentUser?.uid) {
      return onSnapshot(doc(collection(this.firestore, 'users'), this.authService.currentUser.uid), (doc) => {
        console.log(doc.data());
      }
      )
    };
  } */


  /**
   * Sets simple user object
   * 
   * @param obj - single user element data
   * @param id - single user element id
   * @returns 
   */
  setUserObject(obj: any, id: string) {
    return {
      id: id,
      name: obj.name,
      email: obj.email || '',
      photoURL: obj.photoURL || '',
      chatRefs: obj.chatRefs || []
    };
  }


  /**
   * Unsubscribes on destroy
   */
  ngonDestroy() {
    this.unsubUsers();
  }


  /**
   * Sets index of selected user from users array
   * 
   * @param id - user document ref
   * @returns 
   */
  getUsersData(id: string) {
    let index = this.users.findIndex(obj => obj.id === id);
    return index;
  }


  /**
   * Sets currentUserData variabel with signed user data
   * 
   * @returns 
   */
  filterCurrentUser() {
    if (this.users) {
      for (let i = 0; i < this.users.length; i++) {
        const element = this.users[i];
        if (this.authService.uid) {
          if (element.id === this.authService.uid) {
            this.currentUserData = element;
            const username = this.currentUserData; // wofur?
            return; // Beende die Schleife, sobald der Benutzer gefunden wurde
          }
        }
      }
    }
  }


  /**
   * Checks which index this.authService.uid has within members array and returns the other members object
   * 
   * @param members - array of selected chat members
   * @returns 
   */
  getPartnerId(members: string[]) {
    let index = members.indexOf(this.authService.uid);
    if (index === 0) {
      return members[1];
    } else {
      return members[0]
    }
  }
}
