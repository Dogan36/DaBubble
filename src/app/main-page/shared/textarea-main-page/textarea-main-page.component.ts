import { Component, Input } from '@angular/core';
import { Message } from '../../../models/message.class';
import { FormsModule, NgForm } from '@angular/forms';
import { ChannelService } from '../../../services/channel.service';
import { AuthService } from '../../../services/auth.service';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import {MatMenuModule} from '@angular/material/menu';
import { EmojiComponent, EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { FileUploadService } from '../../../services/fileupload.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-textarea-main-page',
  standalone: true,
  imports: [FormsModule, PickerComponent, MatMenuModule, EmojiComponent, NgFor],
  templateUrl: './textarea-main-page.component.html',
  styleUrl: './textarea-main-page.component.scss'
})
export class TextareaMainPageComponent {
  uploadedFiles: { file: File, docRef: any, downloadURL: string }[] = [];

  message: Message = new Message();


  @Input() onChannelBoard:boolean = false;
  @Input() onThreadBoard:boolean = false;
  // @Input() privatTextarea = false;

  constructor(private channelService: ChannelService, private authService: AuthService, public fileUploadService: FileUploadService) { this.uploadedFiles = this.fileUploadService.getUploadedFiles();}

  submitMessage(ngForm: NgForm) {
    if (this.uploadedFiles.length > 0 || this.message.message.trim() !== '') { 
      this.message.member = this.authService.uid;
      this.message.timestamp = Date.now();
  
     
        this.message.uploadedFiles = this.uploadedFiles.map(fileInfo => ({
          name: fileInfo.file.name,
          downloadURL: fileInfo.downloadURL
        }));
        console.log(this.message)
        // Wenn mindestens eine Datei hochgeladen wurde oder die Nachricht nicht leer ist
        if (this.onChannelBoard) {
          this.channelService.startNewChat({ timestamp: this.message.timestamp }, this.channelService.toJSONmessage(this.message));
        } else if (this.onThreadBoard) {
          const selectedChat = this.channelService.selectedChannelChats[this.channelService.selChatIndex];
          if (selectedChat && selectedChat.chatId) {
            this.channelService.addMessageToChat(this.channelService.toJSONmessage(this.message), selectedChat.chatId);
          }
        }
        // Zurücksetzen des Formulars
        ngForm.resetForm();
        // Leeren der hochgeladenen Dateien
        this.uploadedFiles = [];
     
    } else {
      console.log('Ungültige Eingabe');
    }
  }

 deleteFile(index: number) {
    this.fileUploadService.deleteFile(index);
  }

  onEnterKeyPressed(event: Event, ngForm: NgForm) {
    if (!(event as KeyboardEvent).shiftKey && (event as KeyboardEvent).key === 'Enter') {
    event.preventDefault();
      this.submitMessage(ngForm);
    }
  }


  addEmoji($event: EmojiEvent) {
      if($event.emoji.native)
      this.message.message += $event.emoji.native;
      }
  }
