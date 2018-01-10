import { AppService } from './app.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private appService: AppService) {
    this.appService.getMessage().subscribe(data => console.log(data));
    this.appService.getUpdate().subscribe(data => console.log(data));
  }

  enviarTest() {
    let aog = {
      titulo: "teste",
      descricao: "ata",
      time: 100
    }

    this.appService.sendMessage(JSON.stringify(aog));
  }

  getTest() {
    this.appService.getMessage().subscribe(data => console.log(data));
  }

  connect() {
    this.appService.join("Giovani");
  }
}
