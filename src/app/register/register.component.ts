
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAuthServiceService } from '../services/user-auth-service.service';
import { MrouterService } from '../services/mrouter.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  ageList: number[] = [];
  registerForm!:FormGroup;
  aSub!:Subscription;
  errorAll:string="";
  errorfirstName: string = '';
  errorlastName: string = '';
  errorEmail: string = '';
  errorPhone: string = '';
  errorAge: string = '';
  errorDrivingExperience: string = '';
  errorPassword: string = '';
  errorConfirmPassword: string = '';

  constructor(public mrouterService:MrouterService,private auth:UserAuthServiceService)//,private router: Router
   {
    for (let i = 18; i <= 60; i++) {
      this.ageList.push(i);
    }
   }

  ngOnInit() {

    this.registerForm =new FormGroup({
      firstName: new FormControl<string>('', [ Validators.required,  Validators.minLength(3), ]),
      lastName: new FormControl<string>('', [ Validators.required, Validators.minLength(3),]),
      email : new FormControl<string>('', [ Validators.required, Validators.email,]),
      phone : new FormControl<string>('', [ Validators.required,Validators.pattern(/^\d{10}$/), ]),
      age : new FormControl<string>('', [Validators.required,
        Validators.pattern(/^[0-9]+$/), // Перевірка, що введене значення є числом
        Validators.min(18), // Перевірка, що вік більше або рівно 18
      ]),
      drivingExperience : new FormControl<string>('2', [Validators.required,
        Validators.pattern(/^[0-9]+$/), // Перевірка, що введене значення є числом
        Validators.min(1), // Перевірка, що вік більше або рівно 18
      ]),
      password: new FormControl<string>('', [ Validators.required,
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{6,}$/), // Паттерн для великої літери та цифр
      ]),
      confirmPassword: new FormControl<string>('', [ Validators.required,
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{6,}$/), // Паттерн для великої літери та цифр
      ]),
    });
  }

  ngOnDestroy(): void {
    if(this.aSub)//запобігання витіку памяті
    {
       this.aSub.unsubscribe();
    }
  }
  submit() {
    this.cleanError();
    if (this.registerForm.valid)
    {
       if (this.registerForm.value.confirmPassword!==this.registerForm.value.password){
       this.errorConfirmPassword = "Паролі не рівні";
       return;
       }

       this.aSub=this.auth.register(this.registerForm.value).subscribe(
        ()=>{
          // this.router.navigate(['/login']);
          this.mrouterService.router("login")
        },
        error=>
        {
          if (error.error && error.error.errorMessage) {
            this.errorAll="Помилка реєстрації :"+error.error.errorMessage ;
          } else {
            this.errorAll='Невідома помилка при реєстрації';
          }
          this.errorConfirmPassword =error.errorMessage;
          console.warn(error);
          this.registerForm.enable();
        }
      )


    }
     else
      {
         this.valid()
    }
  }


  cleanError()
  {    this.errorAll='';
    this.errorfirstName='';
    this.errorlastName='';
    this.errorEmail='';
    this.errorPhone='';
    this.errorAge='';
    this.errorDrivingExperience='';
    this.errorPassword='';
    this.errorConfirmPassword='';
  }
  valid(  )
  {
    const firstName = this.registerForm.get('firstName');
    const lastName = this.registerForm.get('lastName');
    const email = this.registerForm.get('email');
    const phone = this.registerForm.get('phone');
    const age = this.registerForm.get('age');
    const drivingExperience = this.registerForm.get('drivingExperience');
    const password = this.registerForm.get('password');
    const confirmPassword = this.registerForm.get('confirmPassword');

    if (firstName?.hasError('required'))
      this.errorfirstName = "Потрібно ввести ім'я користувача.";
    else if (firstName?.hasError('minlength'))
      this.errorfirstName = "Ім'я користувача має складатися не менше ніж з 3 символів.";

    if (lastName?.hasError('required'))
      this.errorlastName = "Потрібно ввести прізвище користувача.";
    else if (lastName?.hasError('minlength'))
      this.errorlastName = "Прізвище користувача має складатися не менше ніж з 3 символів.";

      if (email?.hasError('required'))
      this.errorEmail = "Потрібно ввести прізвище користувача.";
    else if (email?.hasError('email'))
      this.errorEmail = "Не коректний формат.";


      if (phone?.hasError('required'))
      this.errorPhone = "Потрібно ввести телефон користувача.";
    else if (phone?.hasError('pattern'))
      this.errorPhone = "Не коректний ввід. Формат вводу 096******* ";

      if (age?.hasError('required'))
      this.errorAge = "Потрібно обрати вік.";

      if (drivingExperience?.hasError('required'))
      this.errorDrivingExperience = "Потрібно досвід водіння.";
      else if (drivingExperience?.hasError('pattern'))
      this.errorDrivingExperience = "Не коректний ввід.";
      else if (drivingExperience?.hasError('min'))
      this.errorDrivingExperience = "Не коректний ввід.";



    if (password?.hasError('required'))
      this.errorPassword = "Потрібно ввести пароль.";
    else if (password?.hasError('pattern'))
      this.errorPassword = "Пароль має складатися не менше ніж з 6 символів і однієї великої літери.";

      if (confirmPassword?.hasError('required'))
      this.errorConfirmPassword = "Потрібно ввести пароль.";
    else if (confirmPassword?.hasError('pattern'))
      this.errorConfirmPassword = "Пароль має складатися не менше ніж з 6 символів і однієї великої літери.";


  }
}
