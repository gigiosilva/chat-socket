import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { HttpModule } from '@angular/http';

import { ChatService } from './chat/chat.service';
import { MaterializeModule } from 'angular2-materialize';
import { AppService } from './app.service';
import { routing } from './app.routing';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { HomeComponent } from './home/home.component';

const config: SocketIoConfig = { url: 'https://chat-in.herokuapp.com', options: {} };
// const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    routing,
    SocketIoModule.forRoot(config),
    HttpModule,
    FormsModule,
    MaterializeModule
  ],
  providers: [
    AppService,
    ChatService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
