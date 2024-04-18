import { Message } from "./message.class";

export class Chat {
    chatId?: string;
    allMessages: Message[];


  constructor(obj?:any) {
    this.chatId = obj ? obj.id : '';
    this.allMessages = obj ? obj.messages: [''];
  }
}