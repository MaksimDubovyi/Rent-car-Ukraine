import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { LocationtenantService } from '../services/locationtenant.service';
import { LessorService } from '../services/lessor.service';
import { UserAuthServiceService } from '../services/user-auth-service.service';
import { TenantCars } from '../model/interfaces';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CarManufacturer, carModels } from '../data/auto';
import { MessagesService } from '../services/messages.service';
import { MrouterService } from '../services/mrouter.service';

@Component({
  selector: 'app-tenant',
  templateUrl: './tenant.component.html',
  styleUrls: ['./tenant.component.css']
})
export class TenantComponent implements  OnInit,OnDestroy {

  constructor (private mrouterService:MrouterService,public messagesService:MessagesService,public locationtenantService:LocationtenantService,public lessorService:LessorService,public auth:UserAuthServiceService)
  {}
  filterForm!:FormGroup;
  carModels: CarManufacturer[]= carModels ;
  selectedCar!: CarManufacturer;

  errorAge: string = '';
  errorDoor: string = '';
  errorNumberOfSeats: string = '';
  errorYear: string = '';
  menuBtn:boolean=false;


  ngOnInit(): void {

    setTimeout(() => {
      this.messagesService.getCountMessageNotRead();
    }, 1000);


    this.filterForm =new FormGroup({
      priceFrom: new FormControl<number| null>(null, [Validators.pattern(/^[0-9]*$/)]),
      priceTo: new FormControl<number| null>(null, [Validators.pattern(/^[0-9]*$/)]),
      ageFrom: new FormControl<number| null>(null, [Validators.pattern(/^[0-9]{4}$/)]),
      ageTo: new FormControl<number| null>(null, [Validators.pattern(/^[0-9]{4}$/)]),
      dateFrom: new FormControl<Date | null>(null),
      dateTo: new FormControl<Date | null>(null),
      climate: new FormControl<boolean>(false),
      brand : new FormControl<string| null>(null),
      model : new FormControl<string| null>(null),
      door: new FormControl<number| null>(0, [Validators.pattern(/^[0-9]{1}$/)]),
      numberOfSeats: new FormControl<number| null>(null, [Validators.pattern(/^[0-9]*$/)]),
      transmissionType: new FormControl<string| null>(null),
      fuelЕype : new FormControl<string| null>(null),
    });


    setTimeout(() => {
      this.locationtenantService.getMyReserve()
    }, 500);

  }

  // Валідатор діапазону дат
  dateRangeValidator(): boolean {
    const fromDateControl = this.filterForm.value.dateFrom;
    const toDateControl = this.filterForm.value.dateTo;

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
  submit()
  {
    if(this.selectedCar)
    this.filterForm.value.brand=this.selectedCar.name;
    this.locationtenantService.filter(this.filterForm.value)
    this.menuActive();
  }



  cancelReservation(tenantCars:TenantCars)
  {
    this.locationtenantService.cancelReservation(tenantCars.idCar)
  }


  menuActive()
  {
    const button = document.getElementById(`filterBlock`);
    if(button)
    {
      if(this.menuBtn)
      {
        this.menuBtn=false;
        button.classList.remove('meny_active');
      }
      else
      {
        this.menuBtn=true;
        button.classList.add('meny_active');
      }
    }
  }

  ngOnDestroy() {

    localStorage.setItem("path","tenant")
    this.mrouterService.back=true;
  }
}
