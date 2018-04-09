import { Injectable } from '@angular/core';
import { Http, Headers, Response} from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import { SocketIoModule, SocketIoConfig, Socket} from 'ng-socket-io';

@Injectable()
export class AppService {

  headers: Headers;

  constructor(private socket: Socket, private http: Http) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
  }

  join(name: any){
    this.socket.emit("join", name);
  }

  sendMessage(msg: any){
    this.socket.emit("send", msg);
  }

  sendMessagesChecked(msg: any) {
    this.socket.emit("messages-checked", msg);
  }

  getMessagesChecked() {
    return this.socket.fromEvent<any>("messages-seen").map(data => JSON.parse(data));
  }

  getMessage() {
    return this.socket.fromEvent<any>("chat").map(data => JSON.parse(data));
  }

  getUpdate() {
    return this.socket.fromEvent<any>("update").map(data => JSON.parse(data));
  }

  getUsers() {
    return this.socket.fromEvent<any>("users").map(data => JSON.parse(data).users);
  }

  close() {
    this.socket.disconnect()
  }

}
