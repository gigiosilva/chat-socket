import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit, HostListener } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment';

import { AppService } from './app.service';
import { ChatMessage } from './chatMessage';

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
  chatMessages: ChatMessage[];
  usersOnline: Object[] = [];
  messageText: string;
  username: string;
  connected: boolean;
  notReadMsg: number = 0;
  favico: any;
  windowActivated: boolean = true;
  showMenuMobile: boolean = false;

  @ViewChild('bodyContainer') private bodyContainer: ElementRef;

  constructor(private appService: AppService) {
    this.appService.getMessage().subscribe(data => this.updateChat(data));
    this.appService.getUpdate().subscribe(data => this.updateChat(data));
    this.appService.getUsers().subscribe(data => this.updateUsers(data));
    this.appService.getMessagesChecked().subscribe(data => this.updateMessagesSeen());
  }

  @HostListener('window:focus', ['$event'])
  onFocus(event: any): void {
    this.windowActivated = true;
    this.removeIconBadge();
    this.appService.sendMessagesChecked('Hello World');
  }

  @HostListener('window:blur', ['$event'])
  onBlur(event: any): void {
    this.windowActivated = false;
  }

  ngOnInit() {
    this.chatMessages = [];
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
        let chatMessage = new ChatMessage;
        chatMessage.msg = "Not connected, refresh the page and enter a name to connect to the chat";
        chatMessage.server = true;

        this.chatMessages.push(chatMessage);
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

  sendMessage(el, e?, input?) {
    if(input == "key") e.preventDefault();
    if(this.messageText.length > 0) {
      let time = moment().format("HH:mm");
      let continuation = false;
      this.appService.sendMessage(this.messageText);
      if(this.chatMessages[this.chatMessages.length - 1]["name"] == this.username) continuation = true;
      this.updateChat({name: this.username, msg: this.messageText, external: false, time: time, continuation: continuation});
      this.messageText = "";
      el.removeAttribute("style");
    }
  }

  updateChat(msg) {
    if(this.connected) {
      let time = moment().format("HH:mm");
      msg.time = time;
      this.chatMessages.push(msg);
      if(!this.windowActivated) {
        this.addIconBadge();
      } else {
        this.appService.sendMessagesChecked('Hello World');
      }
      this.scrollToBottom();
    }
  }

  updateUsers(users) {
    this.usersOnline = [];
    Object.keys(users).forEach(key=>this.usersOnline.push({name: users[key]}));
  }

  updateMessagesSeen() {
    this.chatMessages.map(chatMessage => chatMessage.seen = true);
  }

  scrollToBottom(): void {
    try {
      Observable.timer(100).subscribe(_=> document.querySelector(".last-message").scrollIntoView({block: "end", behavior: "smooth"}));
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
