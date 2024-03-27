import { Injectable, inject } from '@angular/core';
import { Storage } from '@angular/fire/storage';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Observable, from, switchMap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private storage: Storage = inject(Storage);
  constructor() { }
  uploadImage(image: File): Observable<string> {
    const filePath = `images/${Math.floor(Date.now() / 1000)}`;
    const storageRef = ref(this.storage, filePath);
    const uploadTask = from(uploadBytes(storageRef, image));
    return uploadTask.pipe(
      switchMap((result) => getDownloadURL(result.ref))
    )
  }
}
