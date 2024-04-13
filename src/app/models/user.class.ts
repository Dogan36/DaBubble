export class User {
    id: string;
    name: string;
    email: string;
    photoURL: string;
    chatRefs: string []


    constructor(obj?:any) {
        this.id = obj ? obj.id : '';
        this.name = obj ? obj.name : '';
        this.email = obj ? obj.email : '';
        this.photoURL = obj ? obj.photoURL : '';
        this.chatRefs = obj && obj.chatRefs? obj.chatRefs : [];
  }
}