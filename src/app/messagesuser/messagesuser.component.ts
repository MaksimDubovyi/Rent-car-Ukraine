import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MessagesService } from '../services/messages.service';
import { MarkerResponse } from '../model/interfaces';
import { UserAuthServiceService } from '../services/user-auth-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LessorService } from '../services/lessor.service';
import { AutoService } from '../services/auto.service';
import { ElementRef, AfterViewChecked } from '@angular/core';
import { MrouterService } from '../services/mrouter.service';
@Component({
  selector: 'app-messagesuser',
  templateUrl: './messagesuser.component.html',
  styleUrls: ['./messagesuser.component.css']
})
export class MessagesuserComponent implements OnInit, OnDestroy , AfterViewChecked {
  // Використовуємо декоратор @ViewChild, щоб звернутися до DOM-елементу за допомогою шаблонної змінної
  @ViewChild('messageList', { static: false }) private messageList: ElementRef | undefined;
  choiceCar!: MarkerResponse ;
  sendForm!: FormGroup;
  // scrol=true;

  constructor (public mrouterService:MrouterService,public autoService:AutoService, public messagesService:MessagesService,public auth:UserAuthServiceService,public lessorService:LessorService)
  {}

// Метод, який викликається після перевірки представлення компонента
  ngAfterViewChecked() {
        // Викликаємо функцію прокрутки до нижнього кінця
    this.scrollToBottom();
  }

  // Функція для прокрутки скролла до нижнього кінця
  scrollToBottom(): void {
    try {
      if(this.messageList && this.messagesService.scrol===true)
        // Перевіряємо, чи існує об'єкт шаблонної змінної (DOM-елемент
      this.messageList.nativeElement.scrollTop = this.messageList.nativeElement.scrollHeight;
      setTimeout(() => {// вимикаємо прокрутку скролла до нижнього кінця
          this.messagesService.scrol=false;
      }, 3000);

    } catch (err) {
      // Обробляємо можливі помилки і виводимо їх у консоль
      console.error('Помилка при спробі прокрутити вниз:', err);
    }
  }


  ngOnInit() {

     let idCar=localStorage.getItem('choiceCar')
     let whatPage=localStorage.getItem('openMessageList');
     this.messagesService.scrol=true;
    if(idCar)
    {
     this.autoService.getCarInf(idCar)

    }


   setTimeout(() => {
     if(whatPage!=='true')
     {
      this.messagesService.getMessageIdCarIdTenant();
     }
     else
     {
      localStorage.setItem('openMessageList','false');
     }

    }, 100);

    // Ініціалізація форми для відправки повідомлення
    this.sendForm = new FormGroup({
      message: new FormControl<string>("", [Validators.required]),
    });

  }

  submit()
  {

    if(this.sendForm.value.message!="")
    {
      this.messagesService.sendMessage(this.sendForm.value.message);
      setTimeout(() => {  this.scrollToBottom();}, 500);
      this.sendForm.get('message')?.reset('');
    }
    else{
      console.log("не введене повідомлення")
      console.log(this.sendForm.value.message)
    }
    this.sendForm.value.message="";
  }

  ngOnDestroy() {

    localStorage.setItem("path","message")
    this.mrouterService.back=true;

    this.messagesService.scrol=true;
    this.messagesService.MessageShow=[];
    localStorage.removeItem("userLessorId")
    localStorage.removeItem("userTenantId")
  }

}
