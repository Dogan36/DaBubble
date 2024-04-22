import { Message } from "./message.class";

export class Chat {
    chatId?: string;
    timestamp: number;
    allMessages: Message[];


  constructor(obj?:any) {
    this.chatId = obj ? obj.id : '';
    this.timestamp = obj ? obj.timestamp : '';
    this.allMessages = obj ? obj.messages: [''];
  }
}