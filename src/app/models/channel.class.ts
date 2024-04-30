export class Channel {
    id: string;
    name: string;
    creator: string;
    members: string[];
    description?: string;


  constructor(obj?:any) {
    this.id = obj ? obj.id : '';
    this.name = obj ? obj.name : '';
    this.creator = obj ? obj.creator : '';
    this.members = obj ? obj.members : [''];
    this.description = obj ? obj.description : '';
  }
}