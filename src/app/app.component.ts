import { AppService } from './app.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private appService: AppService) { }

  enviarTest() {
    let livro = {
      titulo: "teste",
      descricao: "ata",
      preco: 100
    }
    //this.appService.sendMessage(livro);
    this.appService.msgPost(livro);
  }
}
