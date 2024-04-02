export class Channel {
    id?: string;
    name: string;
    members?: string[];
    threads?: string[];
    description?: string;


  constructor(obj?:any) {
    this.id = obj ? obj.id : '';
    this.name = obj ? obj.name : '';
    this.members = obj ? obj.members : [''];
    this.threads = obj ? obj.threads : [''];
    this.description = obj ? obj.description : '';
  }

//   public toJSON() {
//     return {
//         name: this.name,
//         members: this.members,
//         threads: this.threads,
//         description: this.description
//     };
//   }
}