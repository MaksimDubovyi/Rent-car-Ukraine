import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAuthServiceService } from '../services/user-auth-service.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit,OnDestroy {

  loginForm!:FormGroup;
  codeEmailForm!:FormGroup;
  aSub!:Subscription;

  errorName: string = '';
  errorPassword: string = '';
  errorCode: string = '';
  constructor(public auth:UserAuthServiceService) {}

  ngOnInit() {
         this.loginForm = new FormGroup({
           email: new FormControl<string>("", [  Validators.required, Validators.minLength(3), ]),
           password: new FormControl<string>("", [ Validators.required, Validators.minLength(6),]),
       });

     this.codeEmailForm = new FormGroup({
       codeEmail: new FormControl<string>("", [ Validators.required]),
       });
  }

  clearForm()
  {
    this.loginForm.get('email')?.reset('');
    this.loginForm.get('password')?.reset('');
  }
ngOnDestroy(): void {
  localStorage.setItem("path","main")
    if(this.aSub)//запобігання витіку памяті
    {
       this.aSub.unsubscribe();
    }
}
  submit() {

    this.clearError();

    if (this.loginForm.valid) {
      this.aSub=this.auth.login(this.loginForm.value).subscribe(
      ()=>{this.clearForm();
      },
      error=>
      {
        this.errorPassword = "Не коректні дані.";
        this.loginForm.enable();
      }
    )
    }
    else
    {
        this.valid()
    }
  }

  valid(  )
  {
    const username = this.loginForm.get('email');
    const password = this.loginForm.get('password');
    if (username?.hasError('required'))
    {
      this.errorName = "Потрібно ввести email користувача.";
    }

    if (password?.hasError('required'))
    {
      this.errorPassword = "Потрібно ввести пароль.";
    }
    else if (password?.hasError('minlength'))
     {
      this.errorPassword = "Пароль має складатися не менше ніж з 6 символів.";
    }
  }

  validCod(  )
  {
    const codeEmail = this.codeEmailForm.get('codeEmail');

    if (codeEmail?.hasError('required'))
    {
      this.errorCode = "Потрібно ввести код.";
    }

  }

  clearError()
  {
    this.errorName='';
    this.errorPassword='';
  }
  clearErrorCode()
  {
    this.errorCode='';
  }
  confirmMail()
  {

    this.clearErrorCode();

    if (this.codeEmailForm.valid) {
      let codeEmail = this.codeEmailForm.get('codeEmail');

      this.aSub=this.auth.confirmMail(codeEmail!.value).subscribe(
        () => {

          this.auth.isEmailConfirmCode=false;
        },
        (error) => {
          this.errorCode = "Не вірний код.";
        }
      );

    }
    else
    {
        this.validCod()
    }
  }
}
