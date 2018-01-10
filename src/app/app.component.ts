import { AppService } from './app.service';
import { Component } from '@angular/core';

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

  constructor(private appService: AppService) {
    this.appService.getMessage().subscribe(data => this.updateChat(data));
    this.appService.getUpdate().subscribe(data => console.log(data));
  }

  ngOnInit() {

    this.username = prompt("Please enter your name");
    this.appService.join(this.username);
  }

  sendMessage() {

    this.appService.sendMessage(this.messageText);
    this.updateChat({'name': this.username, 'msg': this.messageText});
  }

  getTest() {

    this.appService.getMessage().subscribe(data => console.log(data));
  }

  updateChat(msg) {
    console.log(msg);
    this.chatMessages.push(msg);
  }

}
