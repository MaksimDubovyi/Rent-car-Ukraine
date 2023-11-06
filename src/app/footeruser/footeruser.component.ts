import { Component } from '@angular/core';
import { MessagesService } from '../services/messages.service';
import { LessorService } from '../services/lessor.service';
import { UserAuthServiceService } from '../services/user-auth-service.service';
import { Router } from '@angular/router';
import { MrouterService } from '../services/mrouter.service';

@Component({
  selector: 'app-footeruser',
  templateUrl: './footeruser.component.html',
  styleUrls: ['./footeruser.component.css']
})
export class FooteruserComponent {

  constructor (public mrouterService:MrouterService,public messagesService:MessagesService,public auth:UserAuthServiceService,public lessorService:LessorService)//private router: Router
  {
    // console.log("НОВИЙ ФУТЕР")
    // this.messagesService.createChatConnection();
  }

  logout()
  {
    this.messagesService.OnDisconnected();
    this.auth.logout();
  }

  messagelist()
  {
    this.mrouterService.router("messagelist")
  }

  back()
  {
    // let path=localStorage.getItem("path");
    // if(path)
    // { this.mrouterService.back=false;
    //   this.mrouterService.router(path)
    // }
    this.mrouterService.backR()
  }

}
