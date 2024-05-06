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

  ngOnInit() {
    console.log('Users are ', this.users);
  }

  subUsersList() {
    return onSnapshot(collection(this.firestore, 'users'), (list) => {
      this.users = [];
      this.usersName = [];
      list.forEach(element => {
        this.users.push(this.setUserObject(element.data(), element.id),);
        this.usersName.push(element.data()['name']);
      })
      this.filterCurrentUser()
    });
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


  setUserObject(obj: any, id: string) {
    return {
      id: id,
      name: obj.name,
      email: obj.email || '',
      photoURL: obj.photoURL || '',
      chatRefs: obj.chatRefs || []
    };
  }


  ngonDestroy() {
    this.unsubUsers();
  }


  getUsersData(id: string) {
    let index = this.users.findIndex(obj => obj.id === id);
    return index;
  }
  

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


  getPartnerId(members: string[]) {
      let index = members.indexOf(this.authService.uid);
      if(index === 0) {
        return members[1];
      } else {
        return members[0]
      }
  }


}
