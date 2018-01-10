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

  getMessage() {
    return this.socket.fromEvent<any>("chat").map(data => JSON.parse(data));
  }

  getUpdate() {
    return this.socket.fromEvent<any>("update");
  }

  close() {
    this.socket.disconnect()
  }

}
