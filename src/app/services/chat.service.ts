import { Injectable, inject } from '@angular/core';
import { Firestore, onSnapshot, collection, addDoc, doc, updateDoc, deleteDoc, query, where, getDoc, DocumentData } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable, switchMap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private firestore: Firestore = inject(Firestore);
  private authService: AuthService = inject(AuthService);
  constructor(

  ) { }


  messages: any[] = []


  subChats(): Observable<DocumentData[]> {
    console.log('subChats() function called');
    const currentUserUid = this.authService.getCurrentUserUid();

    return new Observable<DocumentData[]>(observer => {
      const unsubscribe = currentUserUid.subscribe(uid => {
        if (uid) {
          const chatsQuery = query(
            collection(this.firestore, 'messages'),
            where('users', 'array-contains', uid)
          );

          const unsubscribeSnapshot = onSnapshot(chatsQuery, snapshot => {
            const messages: DocumentData[] = [];
            snapshot.forEach(doc => {
              messages.push(doc.data());
            });
            observer.next(messages);
          });

          // Return function to unsubscribe
          observer.add(() => {
            unsubscribeSnapshot();
            unsubscribe.unsubscribe();
          });
        } else {
          observer.error('Current user ID is not available');
        }
      });
    });
  }


  async getMessageUsernames(message: any): Promise<{ name: string, photoURL: string }[]> {
    const allUserUids: string[] = message.users || [];
    const otherUserUids = allUserUids.filter(uid => uid !== this.authService.userUid);
    console.log(otherUserUids)
    const otherUserNames: { name: string, photoURL: string }[] = [];
    for (const uid of otherUserUids) {
        const userDocRef = doc(this.firestore, 'users', uid);
        const userSnapshot = await getDoc(userDocRef);
        console.log(userSnapshot)
        console.log(userSnapshot.data())
        if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            console.log(userData)
            const name = userData['name'] || 'Unknown';
            const photoURL = userData['photoURL'] || ''; // Falls photoURL nicht vorhanden ist, leeres String verwenden
            console.log(name)
            console.log(photoURL)
            otherUserNames.push({ name, photoURL });
            console.log(otherUserNames)
        } else {
            console.log('User with UID', uid, 'does not exist');
        }
    }
    return otherUserNames;
}




}


