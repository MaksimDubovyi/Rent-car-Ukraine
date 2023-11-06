import {  Component, OnDestroy, OnInit } from '@angular/core';
import { addRenCar, myCar } from '../model/interfaces';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LocationlessarService } from '../services/locationlessar.service';
import { UserAuthServiceService } from '../services/user-auth-service.service';
import { LessorService } from '../services/lessor.service';
import { MarkerService } from '../services/marker.service';
import { MrouterService } from '../services/mrouter.service';
import { MessagesService } from '../services/messages.service';

@Component({
  selector: 'app-lessor',
  templateUrl: './lessor.component.html',
  styleUrls: ['./lessor.component.css'],
})
export class LessorComponent implements OnInit, OnDestroy {
  constructor(public messagesService:MessagesService, public mrouterService:MrouterService ,public locationService:LocationlessarService,public auth:UserAuthServiceService,private markerService: MarkerService,public lessorService:LessorService) {//private router: Router

}


menuBtn:boolean=false;
  // Змінні для відстеження стану меню

  isChoiseCar = false; // Стан вмісту меню
  // Підписка на події
  aSub!: Subscription;

  // Форма для оренди автомобіля
  rentForm!: FormGroup;

  // Помилки для дати "from" та "to"
  errorFrom: string = '';
  errorTo: string = '';
  errorChoiseCar: string = '';

  addRenCar!:addRenCar;
  myCar: myCar | undefined;

  //--------Modal----------
  titleModal:string="1";
  bodyTextModal:string="2";
  //--------Modal----------

  // Метод для перемикання стану меню
  toggleMenu() {
    const menu = document.getElementById(`menu`);
    const content = document.getElementById(`contentd`);

    console.log(content)

    if(menu&&content)
    {
      if(this.menuBtn)
      {
        this.menuBtn=false;
        menu.classList.remove('active_menu');
        content.classList.remove('active_content');
      }
      else
      {
        this.menuBtn=true;
        menu.classList.add('active_menu');
        content.classList.add('active_content');
      }
    }

  }

  //метод отрімання обраного авто
  choiseCar(car: any) {
    this.myCar=car;
    if(this.myCar)
    this.chooseTitleModal(this.myCar.status);

  }

  ngOnInit() {

    setTimeout(() => {
      this.messagesService.getCountMessageNotRead();
    }, 1000);

    this.lessorService.getMyCar();
    this.addRenCar = {} as addRenCar;

    // Ініціалізація форми для оренди автомобіля
    this.rentForm = new FormGroup({
      fromDate: new FormControl<string>("", [Validators.required]),
      toDate: new FormControl<string>("", [Validators.required]),
    });

  }
  ngOnDestroy() {
    localStorage.setItem("path","lessor")
    this.mrouterService.back=true;
  }

  // Валідатор діапазону дат
  dateRangeValidator(): boolean {
    const fromDateControl = this.rentForm.value.fromDate;
    const toDateControl = this.rentForm.value.toDate;

    if (!fromDateControl || !toDateControl) {
      return false; // Якщо один з контролів не існує, повертаємо false
    }

    if (fromDateControl && toDateControl) {
      const fromDateObj = new Date(fromDateControl);
      const toDateObj = new Date(toDateControl);

      if (fromDateObj > toDateObj) {
        return false; // Повертаємо false, якщо fromDate > toDate
      }
    }

    return true; // Повертаємо true, якщо дати валідні
  }

  // Метод для обробки події "Submit" форми
  submit() {
    this.clearError(); // Очищення повідомлень про помилки
    if (this.dateRangeValidator()) {// Перевіряємо чи дати валідні відповідно до валідатора

      const location = this.locationService.getLocation();
      if (this.rentForm.valid&&this.myCar&&location.lat!=0&&location.lng!=0) {// Перевіряємо чи форма валідна

          this.addRenCar.idCar=this.myCar.id;
          this.addRenCar.lat = location.lat;
          this.addRenCar.lng = location.lng;
          this.addRenCar.dateFrom = this.rentForm.value.fromDate;
          this.addRenCar.dateTo = this.rentForm.value.toDate;

          this.markerService.setCarTheMap(this.addRenCar);
         this.clearForm();
      } else {
        this.valid(); // Викликаємо метод valid для перевірки додаткових помилок
      }
    } else {
      this.errorTo = 'Не коректний ввід.'; // Вивід повідомлення про помилку діапазону дат
    }
  }

  // Метод для очищення повідомлень про помилки
  clearError() {
    this.errorFrom = '';
    this.errorTo = '';
    this.errorChoiseCar = '';

  }

  // Метод для перевірки помилок у контролах "from" та "to" та встановлення повідомлень про помилки
  valid() {
    const fromDate = this.rentForm.get('fromDate');
    const toDate = this.rentForm.get('toDate');
    const location = this.locationService.getLocation();
    if(location.lat==0&&location.lng==0)
    this.errorFrom = 'Оберіть адресу';

    if(!this.myCar)
    this.errorChoiseCar = 'Оберіть авто';

    if (fromDate?.hasError('required')) {
      this.errorFrom = 'Потрібно ввести дату.';
    }

    if (toDate?.hasError('required')) {
      this.errorTo = 'Потрібно ввести дату.';
    }
  }


  getButtonText(car: any): string {
    switch (car.status) {

      case 'Підтверджено':
        return 'Відхилити';
      case 'Очікує підтвердження':
        return 'Очікує';
      case 'Вільна':
        return 'Здати';
        case 'Замовлення':
          return 'Підтвердити';
      default:
        return '';
    }
  }
  //-----------Modal-----------
  chooseFunction()
  {
    if(this.titleModal=="Відхилити")
      this.Reject();
     else if(this.titleModal=="Зняти з карти")
      this.RemoveFromMap();
     else if(this.titleModal=="Здати")
      this.SetCarTheMap();
     else if(this.titleModal="Підтвердити")
     this.ConfirmRent();
  }

  chooseTitleModal(title:string)
  {
    if(title=='Підтверджено')
    {
      this.titleModal="Відхилити"
      this.bodyTextModal="Ви дійсно бажаєте відмовити в оренді?"
    }
     else if(title=='Очікує підтвердження')
     {
      this.titleModal="Зняти з карти"
      this.bodyTextModal="Ви дійсно бажаєте зняти авто з карти?"
    }
     else if(title=='Вільна')
     {
      this.titleModal="Здати"
      this.bodyTextModal="Бажаєте встановити авто на карту?"
    }
     else if(title=='Замовлення')
     {
      this.titleModal="Підтвердити"
      this.bodyTextModal="Ви дійсно бажаєте підтвердити та здати авто в оренду?"
    }
  }
  Reject()
  {
    if(this.myCar)
    this.lessorService.CancelmRent(this.myCar.id)
  }
  RemoveFromMap()
  {
    if(this.myCar)
    this.markerService.RemoveFromMap(this.myCar);
  }
  SetCarTheMap()
  {
    this.isChoiseCar=true;
  }
  ConfirmRent()
  {
    if(this.myCar)
    this.lessorService.ConfirmRent(this.myCar.id)
  }

  infCar(car:myCar)
  {
    localStorage.setItem('idcar',car.id)
    this.mrouterService.router("infcar")
  }

  clearForm()
  {
    this.rentForm.get('fromDate')?.reset('');
    this.rentForm.get('toDate')?.reset('');
    this.myCar=undefined;
  }
}

