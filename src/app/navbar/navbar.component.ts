import { Component } from '@angular/core';
import { UserAuthServiceService } from '../services/user-auth-service.service';
import { Router } from '@angular/router';
import { MrouterService } from '../services/mrouter.service';
import { MessagesService } from '../services/messages.service';
import { LessorService } from '../services/lessor.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private mrouterService:MrouterService,public messagesService:MessagesService,public auth:UserAuthServiceService,public lessorService:LessorService)//private router: Router
  {
    console.log("НОВИЙ КОНЕКТ")
    this.messagesService.createChatConnection();
  }

go()
{
  //this.router.navigate(['/personalcabinet']);
  this.mrouterService.router("personalcabinet")
}

selection()
{
  this.mrouterService.router("selection")
}
main()
{
  this.mrouterService.router("main")
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
}
