import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import * as io from 'socket.io-client';

@Injectable()
export class ChatService {
  private url = 'https://chat-in.herokuapp.com';  
  // private url = 'https://chat-socket-node.azurewebsites.net';
  // private url = 'http://localhost:3000';  
  private socket;

  constructor() {
    this.socket = io(this.url);
  }
  
  getMessages() {
    return new Observable(observer => {
      this.socket.on('chat', data => {
        console.log(data)
        observer.next(JSON.parse(data));
      });
    });
  }

  join(name: any, path: string){
    this.socket.emit("join", name, path);
  }

  sendMessage(msg: any){
    this.socket.emit("send", msg);
  }

  sendMessagesChecked(msg: any) {
    this.socket.emit("messages-checked", msg);
  }

  getMessagesChecked() {
    return new Observable(observer => {
      this.socket.on('messages-seen', data => {
        console.log(data)
        observer.next(JSON.parse(data));
      });
    });
  }

  getMessage() {
    return new Observable(observer => {
      this.socket.on('chat', data => {
        console.log(data)
        observer.next(JSON.parse(data));
      });
    });
  }

  getUpdate() {
    return new Observable(observer => {
      this.socket.on('update', data => {
        console.log(data)
        observer.next(JSON.parse(data));
      });
    });
  }

  getUsers() {
    return new Observable(observer => {
      this.socket.on('users', data => {
        console.log(data)
        observer.next(JSON.parse(data));
      });
    });
  }

  close() {
    this.socket.disconnect()
  }

}
