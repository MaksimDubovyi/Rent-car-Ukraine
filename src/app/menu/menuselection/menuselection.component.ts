import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MrouterService } from 'src/app/services/mrouter.service';
import { UserAuthServiceService } from 'src/app/services/user-auth-service.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-menuselection',
  templateUrl: './menuselection.component.html',
  styleUrls: ['./menuselection.component.css']
})
export class MenuselectionComponent implements OnInit,OnDestroy{

  constructor(private userService: UserService,private mrouterService:MrouterService){}//private router: Router

  aSub!:Subscription;
  updatePasswordForm!:FormGroup;
  errorCode:string="";
  updatePF:boolean=false;

  ngOnInit(): void {

    this.updatePasswordForm = new FormGroup({

      email: new FormControl<string>("", [  Validators.required, Validators.minLength(7), ]),
    })

  }
  ngOnDestroy() {

    localStorage.setItem("path","selection")
    this.mrouterService.back=true;
  }
  register()
  {
    this.mrouterService.router("register")
  }

  login()
  {
    this.mrouterService.router("login")
  }

  sendNewPassword()
  {

    this.errorCode ="";

    if (this.updatePasswordForm.valid) {
      let email = this.updatePasswordForm.get('email');

      this.aSub=this.userService.sendNewPassword(email!.value).subscribe(
        () => {
          alert("Новий пароль відправлено на пошту - "+email!.value)
          //this.router.navigate(['/login']);
          this.mrouterService.router("login")
        },
        (error) => {
          this.errorCode = "Не вірна пошта.";
        }
      );

    }
    else
    {
        this.valid()
    }
  }

  valid(  )
  {
    const email = this.updatePasswordForm.get('email');

    if (email?.hasError('required'))
    {
      this.errorCode = "Потрібно ввести email користувача.";
    }

  }

}
