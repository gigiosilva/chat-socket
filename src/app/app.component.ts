import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit, HostListener } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment';

import { AppService } from './app.service';

declare var Favico:any;
declare var $: any;
declare var M: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  chatMessages: Object[] = [];
  messageText: string;
  username: string;
  connected: boolean;
  notReadMsg: number = 0;
  favico: any;
  windowActivated: boolean = true;

  @ViewChild('bodyContainer') private bodyContainer: ElementRef;

  constructor(private appService: AppService) {
    this.appService.getMessage().subscribe(data => this.updateChat(data));
    this.appService.getUpdate().subscribe(data => this.updateChat(data));
    this.appService.getUsers().subscribe(data => this.updateUsers(data));
  }

  @HostListener('window:focus', ['$event'])
  onFocus(event: any): void {
    this.windowActivated = true;
    this.removeIconBadge();
  }

  @HostListener('window:blur', ['$event'])
  onBlur(event: any): void {
    this.windowActivated = false;
  }

  ngOnInit() {
    this.favico = new Favico({
        animation:'none'
    });

    this.username = localStorage.getItem('user');

    if(this.username === null) {
      console.log('entrou')
      this.username = prompt("Please enter your name:");
      if(this.username !== null) {
        this.joinChat();
      } else {
        this.connected = false;
        this.chatMessages.push({msg: "Not connected, refresh the page and enter a name to connect to the chat", server: true});
      }
    } else {
      this.joinChat();
    }
  }

  joinChat() {
    localStorage.setItem('user', this.username);
    this.connected = true;
    this.appService.join(this.username);
  }

  sendMessage(e, input) {
    if(input == "key") e.preventDefault();
    if(this.messageText.length > 0) {
      let time = moment().format("HH:mm");
      let continuation = false;
      this.appService.sendMessage(this.messageText);
      if(this.chatMessages[this.chatMessages.length - 1]["name"] == this.username) continuation = true;
      this.updateChat({name: this.username, msg: this.messageText, external: false, time: time, continuation: continuation});
      this.messageText = "";
    }
  }

  updateChat(msg) {
    if(this.connected) {
      let time = moment().format("HH:mm");
      msg.time = time;
      this.chatMessages.push(msg);
      if(!this.windowActivated) this.addIconBadge();
      this.scrollToBottom();
    }
  }

  updateUsers(users) {
    console.log(users);
  }

  scrollToBottom(): void {
    try {
      Observable.timer(100).subscribe(() => this.bodyContainer.nativeElement.scrollTop = this.bodyContainer.nativeElement.scrollHeight);
    } catch(err) { }                 
  }

  addIconBadge() {
    this.notReadMsg += 1;
    this.favico.badge(this.notReadMsg);
  }

  removeIconBadge() {
    this.notReadMsg = 0;
    this.favico.reset();
  }
}
