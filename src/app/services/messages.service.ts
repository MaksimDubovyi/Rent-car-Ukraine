import { Injectable } from '@angular/core';
import { MarkerResponse, MessageList, MessageResponse, MessageShow } from '../model/interfaces';
import { HubController, MessageController } from '../data/key';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { MessagesuserComponent } from '../messagesuser/messagesuser.component';
@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  // -------------signalr
  choiceCar!: MarkerResponse ;
  messageArra: MessageResponse[] = [];
  MessageShow: MessageShow[] = [];
  noReadMessages:number=0;
  // hubConnection!:signalR.HubConnection;
  messageList: MessageList[] = [];
  scrol=true;
  //-----
 private  chatConnection?:HubConnection;

  constructor() {}


createChatConnection() {
  this.chatConnection = new HubConnectionBuilder()
      .withUrl(HubController)
      .withAutomaticReconnect()
      .build();

  this.chatConnection.start()

      .catch(error => {
          console.log('З єднання НЕ встановлено!!!!!!!!!.');
          console.error(error);
      });

      this.chatConnection.on("UserConnected",()=>{
        console.log('Зєднання підтверджено.');
      this.conectionServer();
      })
      //отримати кількість не прочитаних повідомлень
      this.chatConnection.on("setCountMessageNotRead_",(countMessages)=>{

        this.noReadMessages=countMessages;
       })


        this.chatConnection.on("setMessageList_",(messageList)=>{

         let messageResponse=messageList;
         for(let i=0;i<messageResponse.length;i++)
         {
           if(messageResponse[i].date)
           {
           let date= this.dateTransform(messageResponse[i].date)
           const messageToShow: MessageList = {
             idCar:messageResponse[i].idCar,
             foto: messageResponse[i].foto,
             price: messageResponse[i].price,
             brand: messageResponse[i].brand,
             model: messageResponse[i].model,
             txt: messageResponse[i].txt,
             read: messageResponse[i].read,
             userLessorId:messageResponse[i].userLessorId,
             userTenantId:messageResponse[i].userTenantId,
             online:messageResponse[i].online,
             date: date ,
             showName:messageResponse[i].showName
           };
           this.messageList.push(messageToShow);
           }

         }
         console.log("setMessageList")
         console.log(  this.messageList)
        })

// Отримати повідомлення із конкретним користувачем про конкретне авто
        this.chatConnection.on("setMessageIdCarIdTenant_",(messageList)=>{
          this.MessageShow=[];
          let messageResponse=messageList;
          for(let i=0;i<messageResponse.length;i++)
          {
            if(messageResponse[i].date)
            {
            let date= this.dateTransform(messageResponse[i].date)
            const messageToShow: MessageShow = {
              emailUser: messageResponse[i].emailUser,
              name: messageResponse[i].name,
              txt: messageResponse[i].txt,
              date: date // Формат дати, як ви хочете
            };
            this.MessageShow.push(messageToShow);
            }
          }

         })
 // Відправка повідомлення
         this.chatConnection.on("addMessage_",(response)=>{
          if(response.date)
          {
            let date= this.dateTransform(response.date)
            const messageToShow: MessageShow = {
              emailUser: response.emailUser,
              name: response.name,
              txt: response.txt,
              date: date // Формат дати, як ви хочете
            };

            this.MessageShow.push(messageToShow);
            this.scrol=true;


          }
         })

         // повідомити сервер що користувач не активний
         this.chatConnection.on("UserDisconnected_",(countMessages)=>{
          this.noReadMessages=countMessages;
          localStorage.removeItem("conectionServer")
          console.log("removeItem:conectionServer")
         })

}

stopChatConnection()
{
  this.chatConnection?.stop().catch(error=>{console.log(error)})
}

conectionServer()
{
  // let ifConection = localStorage.getItem("conectionServer")
  // if(!ifConection)
  // {
    console.log('conectionServer');
  let token =localStorage.getItem('AccessToken')
     this.chatConnection?.invoke('Connect',token)
     .catch(err=>console.log("conectionServer",err))
    // }
}



getCountMessageNotRead() {
  console.log('getCountMessageNotRead');
  let token = localStorage.getItem('AccessToken');

  if (this.chatConnection?.state === 'Connected') {
    this.chatConnection.invoke('getCountMessageNotRead', token)
      .catch(err => {
        console.log("getCountMessageNotRead", err);
        console.log("повторне підключення getCountMessageNotRead");
        this.createChatConnection();
      });
  } else {
    setTimeout(() => {// вимикаємо прокрутку скролла до нижнього кінця
      console.log("повторне підключення getCountMessageNotRead2")
      this.createChatConnection();
  }, 2000);
    console.log("З'єднання не готове для використання. Почекайте на з'єднання або відобразіть повідомлення про помилку.");

  }
}

//start message list
getMessageList()
{   this.messageList=[];
  let token =localStorage.getItem('AccessToken')
     this.chatConnection?.invoke('getLatestMessages',token)
     .catch(err=>
      {
        console.log("getAllMessageIdCar",err)
        console.log("повторне підключення getLatestMessages")
        this.createChatConnection();
      }
      )
}


// Отримати повідомлення із конкретним користувачем про конкретне авто
getMessageIdCarIdTenant()
{
  let token =localStorage.getItem('AccessToken')
  let idCar=localStorage.getItem('choiceCar')
  this.chatConnection?.invoke('getAllMessageIdCar',idCar,token)
  .catch(err=>
    {
      console.log("getAllMessageIdCar",err)
      console.log("повторне підключення getAllMessageIdCar")
      this.createChatConnection();
    }
    )
}

getMessageIdCarIdMessageUser(idCar?:string,idUser1?:string,idUser2?:string)
{
  let token =localStorage.getItem('AccessToken')
  this.chatConnection?.invoke('getAllMessageIdCarTL',idCar,idUser1,idUser2,token)
  .catch(err=>
    {
      console.log("getAllMessageIdCarTL",err)
      console.log("повторне підключення getAllMessageIdCarTL")
      this.createChatConnection();
    }
    )
}


 // Відправка повідомлення
 sendMessage(txt:string)
 {
   let token =localStorage.getItem('AccessToken')

   const idCar=localStorage.getItem('choiceCar');
   const userLessorId=localStorage.getItem('userLessorId');
   const userTenantId=localStorage.getItem('userTenantId');

   this.chatConnection?.invoke('sendMessage',idCar,token,txt,userLessorId,userTenantId)
   .catch(err=>
    {
      console.log("sendMessage",err)
      console.log("повторне підключення sendMessage")
      this.createChatConnection();
    }
    )
 }


 dateTransform(date: Date | undefined): string {
      if (date) {
        const inputDate = new Date(date);
        const formattedTime = inputDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const formattedDate = inputDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
        return formattedTime+" "+formattedDate;
      }
      return ''; // Або інше значення за замовчуванням, коли date === undefined
 }

// повідомити сервер що користувач не активний
OnDisconnected()
{
  let token =localStorage.getItem('AccessToken')
     this.chatConnection?.invoke('OnDisconnected',token)
     .catch(err=>
      {
        console.log("OnDisconnected",err)
        console.log("повторне підключення OnDisconnected")
        this.createChatConnection();
      }
      )
}

}
