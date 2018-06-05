import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ChatComponent } from './chat/chat.component';


const appRoutes: Routes = [

    { path:'', component: HomeComponent },
    { path:'**', component: ChatComponent },

];

export const routing = RouterModule.forRoot(appRoutes);