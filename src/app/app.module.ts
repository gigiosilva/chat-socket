import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { HttpModule } from '@angular/http';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SocketIoModule.forRoot(config),
    HttpModule
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
