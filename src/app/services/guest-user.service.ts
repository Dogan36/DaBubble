import { Injectable } from '@angular/core';
import { Firestore, collection, deleteDoc, doc, getDoc, getDocs } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuestUserService {

  private readonly GUEST_USER_KEY = 'guest_user_id';

  constructor(private firestore: Firestore, private authService: AuthService) { }

  async createGuestUser(): Promise<string> {
    this.deleteOldGuests()
    let guestUserId = localStorage.getItem(this.GUEST_USER_KEY);
    if (!guestUserId) {
      // Wenn keine Gastbenutzer-ID im Local Storage vorhanden ist, generieren Sie eine neue
      guestUserId = await this.authService.registerGuest();
      localStorage.setItem(this.GUEST_USER_KEY, guestUserId);
    } else {
      // Überprüfen, ob der Gastbenutzer noch auf Firebase vorhanden ist
      const isGuestUserExisting = await this.isGuestUserOnFirebase(guestUserId);
      if (!isGuestUserExisting) {
        // Wenn der Gastbenutzer nicht auf Firebase vorhanden ist, registrieren Sie ihn erneut
        guestUserId = await this.authService.registerGuest();
        localStorage.setItem(this.GUEST_USER_KEY, guestUserId);
      }
    }
    return guestUserId;
  }

  async isGuestUserOnFirebase(guestUserId: string): Promise<boolean> {
    const userDocRef = doc(this.firestore, 'users', guestUserId);
    console.log('user exists on firebase')
    const docSnapshot = await getDoc(userDocRef);
    return docSnapshot.exists();
  }

  private generateUniqueId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private async deleteOldGuests(): Promise<void> {
    console.log('deleteoldguestscalled');
    const twentyFourHoursAgo = new Date(Date.now() - 2 * 60 * 1000); // Zeitpunkt vor 24 Stunden
    console.log(twentyFourHoursAgo);

    const querySnapshot = await getDocs(collection(this.firestore, 'users'));
    const deletionPromises: Promise<void>[] = [];

    querySnapshot.forEach((doc) => {
        const userData = doc.data();
    

        // Konvertieren Sie das userData['createdAt']-Datum in ein Date-Objekt
        const createdAtDate = new Date(userData['createdAt']);
       
        // Überprüfen, ob es sich um ein Gastkonto handelt und ob es vor mehr als 24 Stunden erstellt wurde
        if (
            userData?.['email']?.endsWith('@guest.de') &&
            createdAtDate < twentyFourHoursAgo
         
        ) {
          console.log(createdAtDate < twentyFourHoursAgo)
            console.log('wird gelöscht');
           // const deletionPromise = deleteDoc(doc.ref);
           // deletionPromises.push(deletionPromise);
        }
    });

    // Warten, bis alle Löschvorgänge abgeschlossen sind
    await Promise.all(deletionPromises);
}
 


}
