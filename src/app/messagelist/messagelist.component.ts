import { Component, OnDestroy } from '@angular/core';
import { MessagesService } from '../services/messages.service';
import { LessorService } from '../services/lessor.service';
import { MessageList } from '../model/interfaces';
import { Router } from '@angular/router';
import { AutoService } from '../services/auto.service';
import { MrouterService } from '../services/mrouter.service';

@Component({
  selector: 'app-messagelist',
  templateUrl: './messagelist.component.html',
  styleUrls: ['./messagelist.component.css']
})
export class MessagelistComponent implements  OnDestroy{

  constructor(private mrouterService:MrouterService,public autoService:AutoService,public messagesService:MessagesService,public lessorService:LessorService)//private router: Router,
  {
    setTimeout(() => {
      this.messagesService.getCountMessageNotRead();
    }, 1000);
    setTimeout(() => {
      this.messagesService.getMessageList()
    }, 1000);
  }

  getMessageAboutCar(message:MessageList)
  {
    if (message.idCar !== undefined&&message.userTenantId !== undefined&&message.userLessorId !== undefined) {

      localStorage.setItem('choiceCar', message.idCar);
      localStorage.setItem('userLessorId', message.userLessorId);
      localStorage.setItem('userTenantId', message.userTenantId);

      // localStorage.setItem('openMessageList', "true");
      //this.router.navigate(['message'])
      this.mrouterService.router("message")

    }
    setTimeout(() => {
      this.messagesService.getMessageIdCarIdMessageUser(message.idCar,message.userLessorId,message.userTenantId);
    }, 2000);

  }


  ngOnDestroy() {

    localStorage.setItem("path","messagelist")
    this.mrouterService.back=true;
  }
}
