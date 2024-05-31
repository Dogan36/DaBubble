import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { getDownloadURL, getStorage, ref, uploadBytesResumable, deleteObject } from "firebase/storage";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private filesToUpload: File[] = [];
  public uploadedFiles: { file: File, docRef: any, downloadURL: string }[] = [];
  private fileSelectedSubject: Subject<File[]> = new Subject<File[]>();
  private storage = getStorage();
  private randomPath = Math.random().toString(36).substring(2);
  private storageRef = ref(this.storage, this.randomPath);
  private isUploading: boolean = false;

  constructor() { }

  chooseFile() {
    if (this.uploadedFiles.length === 0) {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.addEventListener('change', async (event) => {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
          // Leere die Liste der zuvor hochgeladenen Dateien
          this.filesToUpload = [];
          // Füge die neu ausgewählten Dateien hinzu
          const chosenFiles: File[] = Array.from(target.files);
          this.filesToUpload.push(...chosenFiles);
          // Benachrichtige über die Auswahl neuer Dateien
          this.fileSelectedSubject.next(this.filesToUpload);

          // Starte den Upload automatisch nach Auswahl der Datei(en)
          await this.uploadFiles();
        }
      });
      fileInput.click();
    }
  }

  private async uploadFiles() {
    if (this.filesToUpload.length === 0 || this.isUploading) return;
    this.isUploading = true;
    const uploadTasks = this.filesToUpload.map(async (file) => {
      const childRef = ref(this.storageRef, file.name);
      const snapshot = await uploadBytesResumable(childRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      this.uploadedFiles.push({ file, docRef: snapshot.ref, downloadURL });
    });
    try {
      await Promise.all(uploadTasks);
      // Alle Dateien erfolgreich hochgeladen
     
    } catch (error) {
      // Fehler beim Hochladen der Dateien
    } finally {
      this.isUploading = false;
    }
  }

  getUploadedFiles(): { file: File, docRef: any, downloadURL: string }[] {
    return this.uploadedFiles;
  }

  // async deleteFile(fileIndex: number) {
  //   const fileToDelete = this.uploadedFiles[fileIndex];
  //   if (!fileToDelete) return; // Überprüfen, ob das Index valide ist
  //   try {
  //     await deleteObject(fileToDelete.docRef);
  //     this.uploadedFiles.splice(fileIndex, 1);
  //     console.log(this.uploadFiles);
  //   } catch (error) {
  //     console.error('Fehler beim Löschen der Datei:', error);
  //   }
  // }

  async deleteFile() {
    const fileToDelete = this.uploadedFiles[0];
    if (!fileToDelete) return; // Überprüfen, ob das Index valide ist
    try {
      await deleteObject(fileToDelete.docRef);
      // this.uploadedFiles.splice(fileIndex, 1);
      this.uploadedFiles.splice(0, 1);
      console.log(this.uploadFiles);
    } catch (error) {
      console.error('Fehler beim Löschen der Datei:', error);
    }
  }
}