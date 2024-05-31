import { Injectable } from '@angular/core';
import { Firestore, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuestUserService {

  private readonly GUEST_USER_KEY = 'guest_user_id';

  constructor(private firestore: Firestore, private authService: AuthService) { }

  async createGuestUser(): Promise<string> {
    let guestUserId = localStorage.getItem(this.GUEST_USER_KEY);
    if (!guestUserId) {
      // Wenn keine Gastbenutzer-ID im Local Storage vorhanden ist, generieren Sie eine neue
      guestUserId = await this.authService.registerGuest();
      localStorage.setItem(this.GUEST_USER_KEY, guestUserId);
    } else {
      // Überprüfen, ob der Gastbenutzer noch auf Firebase vorhanden ist
      const isGuestUserExisting = await this.isGuestUserOnFirebase(guestUserId);
      if (guestUserId && isGuestUserExisting) { this.authService.loginGuest(guestUserId) }
      if (!isGuestUserExisting) {
        // Wenn der Gastbenutzer nicht auf Firebase vorhanden ist, registrieren Sie ihn erneut
        guestUserId = await this.authService.registerGuest();
        localStorage.setItem(this.GUEST_USER_KEY, guestUserId);
      }
    }
    return guestUserId;
  }

  async isGuestUserOnFirebase(guestUserId: string): Promise<boolean> {
    try {
      const userDocRef = doc(this.firestore, 'users', guestUserId);
      const docSnapshot = await getDoc(userDocRef);
      return docSnapshot.exists();
    } catch (error) {
    
      return false;
    }
  }

  public async deleteOldGuests(): Promise<void> {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const querySnapshot = await getDocs(collection(this.firestore, 'users'));
    const deletionPromises: Promise<void>[] = [];
    querySnapshot.forEach(async (doc) => {
      const userData = doc.data();
      const userId = doc.id;
      const createdAtDate = new Date(userData['createdAt']);
      if (
        userData?.['email']?.endsWith('@guest.de') &&
        createdAtDate < twentyFourHoursAgo
      ) {
        console.log(createdAtDate < twentyFourHoursAgo)
        console.log('wird gelöscht');
        // Löschen der Kanäle, die von diesem Benutzer erstellt wurden
        await this.deleteChannelsByUser(userId); // Aufruf der Methode innerhalb der forEach-Schleife
        await this.deleteReactionsByUser(userId)
        await this.deleteChatsByUser(userId); // Aufruf der Methode innerhalb der forEach-Schleife
        await this.deleteMessagesByUser(userId); // Aufruf der Methode innerhalb der forEach-Schleife
        await this.removeUserFromChannels(userId)
        const deletionPromise = deleteDoc(doc.ref);
        deletionPromises.push(deletionPromise);
      }
    });
    // Warten, bis alle Löschvorgänge abgeschlossen sind
    await Promise.all(deletionPromises);
  }

  private async deleteChannelsByUser(userId: string): Promise<void> {
    const querySnapshot = await getDocs(query(collection(this.firestore, 'channels'), where('creator', '==', userId)));
    const deletionPromises: Promise<void>[] = [];
    querySnapshot.forEach((doc) => {
      const deletionPromise = deleteDoc(doc.ref);
      deletionPromises.push(deletionPromise);
    });
    // Warten, bis alle Löschvorgänge abgeschlossen sind
    await Promise.all(deletionPromises);
  }

  private async deleteChatsByUser(userId: string): Promise<void> {
    const querySnapshot = await getDocs(query(collection(this.firestore, 'chats'), where('members', 'array-contains', userId)));
    const deletionPromises: Promise<void>[] = [];
    querySnapshot.forEach((doc) => {
      const deletionPromise = deleteDoc(doc.ref);
      deletionPromises.push(deletionPromise);
    });
    // Warten, bis alle Löschvorgänge abgeschlossen sind
    await Promise.all(deletionPromises);
  }

  private async removeUserFromChannels(userId: string): Promise<void> {
    const querySnapshot = await getDocs(query(collection(this.firestore, 'channels'), where('members', 'array-contains', userId)));
    const updatePromises: Promise<void>[] = [];
    querySnapshot.forEach((doc) => {
      const channelRef = doc.ref;
      const members = doc.data()['members'].filter((memberId: string) => memberId !== userId); // Entfernen Sie die Benutzer-ID aus dem Array
      const updatePromise = updateDoc(channelRef, { members }); // Aktualisieren Sie das Dokument, um die Benutzer-ID zu entfernen
      updatePromises.push(updatePromise);
    });
    // Warten, bis alle Aktualisierungsvorgänge abgeschlossen sind
    await Promise.all(updatePromises);
  }

  private async deleteMessagesByUser(userId: string): Promise<void> {
    const querySnapshot = await getDocs(query(collection(this.firestore, 'channels'), where('members', 'array-contains', userId)));
    const deletionPromises: Promise<void>[] = [];
    querySnapshot.forEach(async (doc) => {
      const channelId = doc.id;
      const chatQuerySnapshot = await getDocs(collection(this.firestore, `channels/${channelId}/chats`));
      chatQuerySnapshot.forEach(async (chatDoc) => {
        const messagesCollection = collection(this.firestore, `channels/${channelId}/chats/${chatDoc.id}/messages`);
        const messageQuerySnapshot = await getDocs(query(messagesCollection, where('member', '==', userId)));
        messageQuerySnapshot.forEach((messageDoc) => {
          const deletionPromise = deleteDoc(messageDoc.ref);
          deletionPromises.push(deletionPromise);
        });
      });
    });

    // Warten, bis alle Löschvorgänge abgeschlossen sind
    await Promise.all(deletionPromises);
  }

  private async deleteReactionsByUser(userId: string): Promise<void> {
    const querySnapshot = await getDocs(query(collection(this.firestore, 'channels'), where('members', 'array-contains', userId)));
    const deletionPromises: Promise<void>[] = [];
    querySnapshot.forEach(async (doc) => {
      const channelId = doc.id;
      const chatQuerySnapshot = await getDocs(collection(this.firestore, `channels/${channelId}/chats`));
      chatQuerySnapshot.forEach(async (chatDoc) => {
        const messagesCollection = collection(this.firestore, `channels/${channelId}/chats/${chatDoc.id}/messages`);
        const messageQuerySnapshot = await getDocs(messagesCollection);
        messageQuerySnapshot.forEach(async (messageDoc) => {
          const messageData = messageDoc.data();
          if (messageData['reactions']) {
            const reactions = Object.entries(messageData['reactions']);
            const updatedReactions = reactions.filter(([uid, _]) => uid !== userId);
            await updateDoc(messageDoc.ref, { reactions: Object.fromEntries(updatedReactions) });
          }
        });
      });
    });
    // Warten, bis alle Löschvorgänge abgeschlossen sind
    await Promise.all(deletionPromises);
  }
}
