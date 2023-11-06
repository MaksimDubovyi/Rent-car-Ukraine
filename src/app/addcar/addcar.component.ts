import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AutoService } from '../services/auto.service';
import {CarManufacturer, carModels} from '../data/auto'
import { DatePipe } from '@angular/common';
import { AddCar, myCar, requestFile_name} from '../model/interfaces';
import { HttpClient } from '@angular/common/http';
import { LessorService } from '../services/lessor.service';
import { MrouterService } from '../services/mrouter.service';

@Component({
  selector: 'app-addcar',
  templateUrl: './addcar.component.html',
  styleUrls: ['./addcar.component.css']
})
export class AddcarComponent implements OnInit, OnDestroy {


  carModels: CarManufacturer[]= carModels ;
  selectedCar!: CarManufacturer;
  registerForm!:FormGroup;
  aSub!:Subscription;
  ageList: number[] = [];

  errorPrice: string = '';
  errorBrand: string = '';
  errorModel: string = '';
  errorAge: string = '';
  errorDoor: string = '';
  errorColor: string = '';
  errorNumberOfSeats: string = '';
  errorEngineCapacity: string = '';
  errorTransmissionType: string = '';
  errorFuelType: string = '';
  errorFoto: string = '';

  onFileSelected(input: HTMLInputElement): void {
    //якщо файл обрано формуємо та зберігаємо FormData для подальшої відправки на сервер
    if (input.files != null && input.files.length > 0) {
        const selectedFile = input.files[0];
        if (selectedFile) {
            let fileData = new FormData();
            fileData.append('upload', selectedFile);
            fileData.append('folder', "car");        // сервер буде визначати до якої папки додавати фото
            this.autoService.fileData=fileData;
        }
    }
}


  constructor( public mrouterService:MrouterService ,private autoService:AutoService,private lessorService:LessorService)
   {
    for (let i = 18; i <= 60; i++) {
      this.ageList.push(i);
    }
   }




  ngOnInit() {

    this.registerForm =new FormGroup({
      price: new FormControl<number>(0, [ Validators.required,Validators.pattern(/^[0-9]*$/)]),
      brand : new FormControl<string>('', [ Validators.required]),
      model : new FormControl<string>('', [ Validators.required]),
      age: new FormControl<number>(0, [ Validators.required,Validators.pattern(/^[0-9]{4}$/)]),
      climate: new FormControl<boolean>(false),
      door: new FormControl<number>(0, [ Validators.required,Validators.pattern(/^[0-9]{1}$/)]),
      color: new FormControl<string>('', [ Validators.required]),
      numberOfSeats: new FormControl<number>(0, [ Validators.required,Validators.pattern(/^[0-9]*$/)]),
      engineCapacity: new FormControl<number>(0, [ Validators.required,Validators.pattern(/^[0-9]*$/)]),
      transmissionType: new FormControl<string>("", [ Validators.required]),
      fuelЕype : new FormControl<string>('', [Validators.required]),
    });
  }
  clearForm()
  {
    this.registerForm.get('price')?.reset(0);
    this.registerForm.get('brand')?.reset('');
    this.registerForm.get('model')?.reset('');
    this.registerForm.get('age')?.reset(0);
    this.registerForm.get('climate')?.reset(false);
    this.registerForm.get('door')?.reset(0);
    this.registerForm.get('color')?.reset('');
    this.registerForm.get('numberOfSeats')?.reset(0);
    this.registerForm.get('engineCapacity')?.reset(0);
    this.registerForm.get('transmissionType')?.reset('');
    this.registerForm.get('fuelЕype')?.reset('');
    this.autoService.fileData=null;
  }
  ngOnDestroy(): void {
    if(this.aSub)//запобігання витіку памяті
    {
       this.aSub.unsubscribe();
    }
  }




  submit() {
    this.registerForm.value.brand=this.selectedCar.name;
    this.cleanError();
    if (this.registerForm.valid)
    {
      if(this.autoService.fileData)
      {
          // Якщо всі параметри валідні, то спочатку відправляю фото на сервер
        this.autoService.saveFotoServer().subscribe((response: requestFile_name) => {
              // Оновлення аватара після отримання відповіді
              if (response && response.file_name)
              {
                // Якщо фото було збережено сервер повертає нове унікальне ім'я файлу
                // зберігаємо його та викликаємо метод addCar для збереження об'єкта  в БД
                this.autoService.fileName= response.file_name;
                this.aSub=this.autoService.addCar(this.registerForm.value).subscribe(
                  (addCar: myCar) => {
                    // якщо все добре повертається новий об'єкт авто та додаємо його до списку власних авто
                    console.log("Відповів компонент додавання авто:" , addCar);
                    let newCar: myCar = addCar;
                   newCar.status="free";
                   this.lessorService.getMyCar();
                   this.clearForm()
                  }
                );
              }
          },
          (error) => {
              console.error("Помилка при підписці на відповідь сервера:", error);
          });


      }
      else
      {
        this.errorFoto = "Оберіть фото авто";
      }

    }
     else
      { for (const controlName in this.registerForm.controls) {
        const control = this.registerForm.controls[controlName];
        if (control.invalid) {
          const errors = control.errors;
          console.log(`Поле ${controlName} має помилки:`, errors);
        }
      }
        this.valid()
      }
  }


  cleanError()
  {
    this.errorPrice='';
    this.errorBrand='';
    this.errorModel='';
    this.errorAge='';
    this.errorDoor='';
    this.errorColor='';
    this.errorNumberOfSeats='';
    this.errorEngineCapacity='';
    this.errorTransmissionType='';
    this.errorFuelType='';
    this.errorFoto='';
  }
  valid(  )
  {
    const price = this.registerForm.get('price');
    const brand = this.registerForm.get('brand');
    const model = this.registerForm.get('model');
    const age = this.registerForm.get('age');
    const door = this.registerForm.get('door');
    const color = this.registerForm.get('color');
    const numberOfSeats = this.registerForm.get('numberOfSeats');
    const engineCapacity = this.registerForm.get('engineCapacity');
    const transmissionType = this.registerForm.get('transmissionType');
    const fuelЕype = this.registerForm.get('fuelЕype');

    if (price?.hasError('required'))
      this.errorPrice = "Потрібно ввести ціну користувача.";
    else if (price?.hasError('pattern'))
      this.errorPrice = "Не коректний ввід.";

    if (brand?.hasError('required'))
      this.errorBrand = "Оберіть марку авто";

      if (model?.hasError('required'))
      this.errorModel = "Оберіть модель авто.";

      if (age?.hasError('required'))
      this.errorAge = "Введіть рік.";
     else if (age?.hasError('pattern'))
      this.errorAge = "Не коректний ввід.";

      if ( door?.hasError('required'))
      this.errorDoor = "Введіть кількість дверей.";
     else if ( door?.hasError('pattern'))
      this.errorDoor = "Не коректний ввід.";

      if ( color?.hasError('required'))
      this.errorColor = "Оберіть колір.";

      if ( numberOfSeats?.hasError('required'))
      this.errorNumberOfSeats = "Введіть кількість місць.";
     else if ( numberOfSeats?.hasError('pattern'))
      this.errorNumberOfSeats = "Не коректний ввід.";

      if ( engineCapacity?.hasError('required'))
      this.errorEngineCapacity = "Введіть обєм двигуна.";
     else if ( engineCapacity?.hasError('pattern'))
      this.errorEngineCapacity = "Не коректний ввід.";

      if ( transmissionType?.hasError('required'))
      this.errorTransmissionType = "Оберіть тип.";

      if ( fuelЕype?.hasError('required'))
      this.errorFuelType = "Оберіть тип.";



  }
}

