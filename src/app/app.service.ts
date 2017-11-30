import { Injectable } from '@angular/core';
import { Http, Headers, Response} from '@angular/http';
import { Observable } from 'rxjs';
import { SocketIoModule, SocketIoConfig, Socket} from 'ng-socket-io';

@Injectable()
export class AppService {

  headers: Headers;

  constructor(private socket: Socket, private http: Http) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
  }

  sendMessage(msg: any){
    this.socket.emit("message", msg);
  }

  getMessage() {
      return this.socket
          .fromEvent<any>("message")
          .map(data => data.msg );
  }

  close() {
    this.socket.disconnect()
  }

  msgPost(msg: any){

    let body = {
      mensagem: "oi",
      livro: { id: 2 }
    }

    this.http
    .post('http://localhost:3000/promocoes', JSON.stringify(body), { headers: this.headers })
    .subscribe(res => {}, 
      erro => {
        console.log(erro);
    });
  }

}
