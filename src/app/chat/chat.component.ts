import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import * as moment from 'moment';

import { ChatService }       from './chat.service';
import { Chat } from './chat';

declare var Favico:any;
declare var $: any;
declare var M: any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  chatMessages: Chat[];
  usersOnline: Object[] = [];
  messageText: string;
  username: string;
  connected: boolean;
  notReadMsg: number = 0;
  favico: any;
  windowActivated: boolean = true;
  showMenuMobile: boolean = false;
  path: string;

  messageSub: Subscription;
  updateSub: Subscription;
  usersSub: Subscription;
  messageCheckedSub: Subscription;

  @ViewChild('bodyContainer') private bodyContainer: ElementRef;

  constructor(private chatService: ChatService, private router: Router) {
    this.messageSub = this.chatService.getMessage().subscribe(data => this.updateChat(data));
    this.updateSub = this.chatService.getUpdate().subscribe(data => this.updateChat(data));
    this.usersSub = this.chatService.getUsers().subscribe(data => this.updateUsers(data));
    this.messageCheckedSub = this.chatService.getMessagesChecked().subscribe(data => this.updateMessagesSeen());
  }

  @HostListener('window:focus', ['$event'])
  onFocus(event: any): void {
    this.windowActivated = true;
    this.removeIconBadge();
    this.chatService.sendMessagesChecked('Hello World');
  }

  @HostListener('window:blur', ['$event'])
  onBlur(event: any): void {
    this.windowActivated = false;
  }

  ngOnInit() {
    this.path = this.router.url;
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
        let chatMessage = new Chat;
        chatMessage.msg = "Not connected, refresh the page and enter a name to connect to the chat";
        chatMessage.server = true;

        this.chatMessages.push(chatMessage);
      }
    } else {
      this.joinChat();
    }
  }

  ngOnDestroy() {
    this.messageSub.unsubscribe();
    this.updateSub.unsubscribe();
    this.usersSub.unsubscribe();
    this.messageCheckedSub.unsubscribe();
    this.chatService.close();
  }

  joinChat() {
    localStorage.setItem('user', this.username);
    this.connected = true;
    this.chatService.join(this.username, this.path);
  }

  sendMessage(el, e?, input?) {
    if(input == "key") e.preventDefault();
    if(this.messageText.length > 0) {
      let time = moment().format("HH:mm");
      let continuation = false;
      this.chatService.sendMessage(this.messageText);
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
        this.chatService.sendMessagesChecked('Hello World');
      }
      this.scrollToBottom();
    }
  }

  updateUsers(users) {
    users = users.users;
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
