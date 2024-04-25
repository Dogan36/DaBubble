import { Reaction } from "./reaction.class"

export class Message {
    messageId: string;
    message: string;
    member: string;
    reactions: Reaction[];
    timestamp: number;


  constructor(obj?:any) {
    this.messageId = obj ? obj.id : '';
    this.message = obj ? obj.message: '';
    this.member = obj ? obj.member : '';
    this.reactions = obj ? obj.reactions : [],
    this.timestamp = obj ? obj.timestamp : '';
  }
}