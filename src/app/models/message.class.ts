export class Message {
    messageId?: string;
    message: string;
    member: string;
    timestamp: number;
    // reactions?: string[]; // noch mal klären wie wir die Reaktinen abspeichern wollen! 
    // chatRef?: string;  soll noch mal jede Message die chatRef abgespeichert bekommen, um die Zuweisung zum Chat zu ermöglichen?
    // type: 'channelChat' || 'privatChat';  soll noch mal jede message abgespeichert bekommen zu welchem type sie gehört?


  constructor(obj?:any) {
    this.messageId = obj ? obj.id : '';
    this.message = obj ? obj.message: '';
    this.member = obj ? obj.member : '';
    this.timestamp = obj ? obj.timestamp : '';
    // this.reactions = obj ? obj.reactions : [''];
    // this.chatRef = obj ? obj.chatRef : '';
    // this.type = obj ? obj.type : '';
  }
}