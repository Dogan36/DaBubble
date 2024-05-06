export class PrivateChat {
    chatId: string;
    timestamp: number;
    members: string[];


  constructor(obj?:any) {
    this.chatId = obj ? obj.id : '';
    this.timestamp = obj ? obj.timestamp : '';
    this.members = obj ? obj.members: [''];
  }
}