import { Message } from "../types/messages.class";

export class Chat {
    chatId?: string;
    messages: Message[];


  constructor(obj?:any) {
    this.chatId = obj ? obj.id : '';
    this.messages = obj ? obj.messages: [''];
  }
}