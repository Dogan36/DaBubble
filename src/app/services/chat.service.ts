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

  currentChat: any
  messages: any[] = []


  subChats(): Observable<DocumentData[]> {
    console.log('subChats() function called');
    return new Observable<DocumentData[]>(observer => {
      this.authService.getCurrentUser().subscribe(user => {
        if (user) {
          const uid = user.uid; // Hier wird die UID des Benutzers extrahiert
          console.log(uid)
       
        if (uid) {
          const chatsQuery = query(
            collection(this.firestore, 'messages'),
            where('users', 'array-contains', uid)
          );
          const unsubscribeSnapshot = onSnapshot(chatsQuery, snapshot => {
            const messages: DocumentData[] = [];
            snapshot.forEach(doc => {
              messages.push(doc.data());
              console.log(messages)
            });
            observer.next(messages);
          });

          // Return function to unsubscribe
          observer.add(() => {
            unsubscribeSnapshot();
          });
        } else {
          observer.error('Current user ID is not available');
        }}
      });
    });
  
  }


  async getMessageUsernames(message: any): Promise<{ name: string, photoURL: string, uid: string }[]> {
    const allUserUids: string[] = message.users || [];
    console.log(allUserUids)
    const otherUserUids = allUserUids.filter(uid => uid !== this.authService.currentUser?.uid);
    const otherUserNames: { name: string, photoURL: string, uid: string }[] = [];
    if (allUserUids.length > 1) {
      for (const uid of otherUserUids) {
        const userDocRef = doc(this.firestore, 'users', uid);
        const userSnapshot = await getDoc(userDocRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          const name = userData['name'] || 'Unknown';
          const photoURL = userData['photoURL'] || ''; // Falls photoURL nicht vorhanden ist, leeres String verwenden
          otherUserNames.push({ name, photoURL, uid });
          console.log(userData)
          console.log(otherUserNames)

        } else {
          console.log('User with UID', uid, 'does not exist');
        }
      }
    } else {

      const name = this.authService.currentUser?.displayName || 'Unknown';
      const uid = this.authService.currentUser?.uid as string;
      const photoURL = this.authService.photoURL || ''; // Falls photoURL nicht vorhanden ist, leeres String verwenden
      otherUserNames.push({ name, photoURL, uid });
    }

    return otherUserNames;
  }




}


