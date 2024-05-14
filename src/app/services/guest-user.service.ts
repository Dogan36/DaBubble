import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
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

  getGuestUserId(): string | null {
    return localStorage.getItem(this.GUEST_USER_KEY);
  }

  clearGuestUserId(): void {
    localStorage.removeItem(this.GUEST_USER_KEY);
  }


}
