import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit, HostListener } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { AppService } from './app.service';

declare var Favico:any;

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
  windowActivated: boolean;

  @ViewChild('bodyContainer') private bodyContainer: ElementRef;

  constructor(private appService: AppService) {
    this.appService.getMessage().subscribe(data => this.updateChat(data));
    this.appService.getUpdate().subscribe(data => this.updateChat(data));
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

    this.username = prompt("Please enter your name:");
    if(this.username !== null) {
      this.connected = true;
      this.appService.join(this.username);
    } else {
      this.connected = false;
      this.chatMessages.push({msg: "Not connected, refresh the page and enter a name to connect to the chat", server: true});
    }
  }

  sendMessage() {

    if(this.messageText.length > 0) {
      this.appService.sendMessage(this.messageText);
      this.updateChat({name: this.username, msg: this.messageText, external: false});
      this.messageText = "";
    }
  }

  updateChat(msg) {

    if(this.connected) {
      this.chatMessages.push(msg);
      if(!this.windowActivated) this.addIconBadge();
      this.scrollToBottom();
    }
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
