import { Component, ElementRef,OnDestroy,OnInit,ViewChild } from '@angular/core';
import { UserAuthServiceService } from '../services/user-auth-service.service';
import {  AuthResponse, TokenModel, UserShow } from '../model/interfaces';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { UserService } from '../services/user.service';
import { MessagesService } from '../services/messages.service';
import { MrouterService } from '../services/mrouter.service';



@Component({
  selector: 'app-personalcabinet',
  templateUrl: './personalcabinet.component.html',
  styleUrls: ['./personalcabinet.component.css']
})
export class PersonalcabinetComponent implements OnInit,OnDestroy{
  @ViewChild('fileInput') fileInput!: ElementRef; // Отримання доступу до елементу input
 updatePasswordForm!:FormGroup;
  errorCode:string="";
  updatePF:boolean=false;

  constructor(public messagesService:MessagesService,public auth: UserAuthServiceService,private userService: UserService,private mrouterService:MrouterService) {}


  ngOnInit(): void {

    setTimeout(() => {
      this.messagesService.getCountMessageNotRead();
    }, 2000);

    this.userService.getUser();

    this.updatePasswordForm = new FormGroup({

      password: new FormControl<string>("", [ Validators.required, Validators.minLength(6),]),
    })

  }
  tenant()
  { this.mrouterService.router("tenant")

  }
  lessor()
  { this.mrouterService.router("lessor")}


  updatePassword()
  {
    this.errorCode='';
    if (this.updatePasswordForm.valid) {
      let password = this.updatePasswordForm.get('password');

      this.userService.updatePassword(password!.value).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
               //якщо токен застарілий
              this.auth.RefreshToken().subscribe((authResponse: TokenModel) => {
                  localStorage.setItem("AccessToken", authResponse.accessToken);
                  localStorage.setItem("RefreshToken", authResponse.refreshToken);
                  this.updatePassword()
              });
          } else console.error('Інша помилка:', error);

          // Перенаправте помилку наверх для подальшої обробки
          return throwError(error);
        })
      )
      .subscribe(
        () => {
           this.updatePF=false
          },
        (error) => {
          this.errorCode = "error";
        }
      );

    }
    else
    {
        this.validPassword()
    }
  }
  validPassword(  )
  {
    const password = this.updatePasswordForm.get('password');

    if (password?.hasError('required'))
    {
      this.errorCode = "Потрібно ввести пароль.";
    } else if (password?.hasError('minlength'))
    {
     this.errorCode = "Пароль має складатися не менше ніж з 6 символів.";
   }

  }
  openFileInput() {
    // Відкрити вікно вибору файлу, коли клікаємо на фото
    this.fileInput.nativeElement.click();
  }

  fileInputChange(input: HTMLInputElement): void {
     this.userService.fileInputChange(input);
   }

  updateAvater(namee: string): void {
    this.userService.updateAvater(namee);
  }
  ngOnDestroy() {

    localStorage.setItem("path","personalcabinet")
    this.mrouterService.back=true;
  }
}

