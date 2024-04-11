import { Injectable, inject } from '@angular/core';
import { Firestore, onSnapshot, collection, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { User } from '../models/user.class';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  firestore: Firestore = inject(Firestore);

  users: User[] = [];
  usersName: string[] = [];
  selectedUser: number = 0;

  unsubUsers;

  constructor() {
    this.unsubUsers = this.subUsersList();
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
    });
    }


  setUserObject(obj:any, id: string) {
    return {
      id: id,
      name: obj.name,
      email: obj.email || '',
      photoURL: obj.photoURL || ''
    };
  }


  ngonDestroy() {
    this.unsubUsers();
  }


  getUsersData(id:string) {
    let index = this.users.findIndex(obj => obj.id === id);
    return index;
  }
}
