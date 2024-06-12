import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Injectable({
  providedIn: 'root'
})
export class FormatUrlsService {

  constructor(
    private sanitizer: DomSanitizer,
  
  ) { }
  formatUrls(message: string): SafeHtml {
    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]|www\.[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    const formattedMessage = message.replace(urlRegex, (url) => {
      let hyperlink = url;
      if (!hyperlink.startsWith('http')) {
        hyperlink = 'http://' + hyperlink;
      }
      return `<a href="${hyperlink}" target="_blank">${url}</a>`;
    });
    return this.sanitizer.bypassSecurityTrustHtml(formattedMessage);
  }
}
