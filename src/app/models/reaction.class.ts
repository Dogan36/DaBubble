export class Reaction {
    reactUser: string;
    reactEmoji: string;


  constructor(obj?:any) {
    this.reactUser = obj ? obj.reactUser : '';
    this.reactEmoji = obj ? obj.reactEmoji : '';
  }
}