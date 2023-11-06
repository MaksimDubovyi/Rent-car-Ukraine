import { Injectable } from '@angular/core';
import  { Map, Marker,Popup } from 'maplibre-gl';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserLocation } from '../map/model/Location';
import { catchError } from 'rxjs/operators';
import { CarController, MarkerController,myKeyGoogle } from '../data/key';
import { Filter, MarkerResponse, TenantCars, TokenModel } from '../model/interfaces';
import { LessorService } from './lessor.service';
import { LocationService } from './location.service';
import { UserAuthServiceService } from './user-auth-service.service';
import { MessagesService } from './messages.service';
import { MrouterService } from './mrouter.service';


@Injectable({
  providedIn: 'root'
})
export class LocationtenantService {

  constructor(private messagesService:MessagesService,private mrouterService:MrouterService,private http: HttpClient, private lessorService:LessorService, private locationService:LocationService,private auth:UserAuthServiceService) { }//private router: Router,
  clickAddress!: "";
  markerResponse!: MarkerResponse[] ;
  carsWaiting: TenantCars[] = [];
  map: Map | undefined;
  markers: Marker[] = [];
  // Скасувати бронювання авто
  cancelReservation(idCar:string)
  {
    const accessToken = localStorage.getItem('AccessToken');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${accessToken}`,
  });


  return this.http.post< TenantCars[]>(CarController+`cancel-reservation?idCar=${idCar}&tenantEmail=${accessToken}`, null, { headers }).pipe(

    catchError((error: any) => {
      if (error.status === 401)
      {
              //якщо токен застарілий
             this.auth.RefreshToken().subscribe((authResponse: TokenModel) => {
                 localStorage.setItem("AccessToken", authResponse.accessToken);
                 localStorage.setItem("RefreshToken", authResponse.refreshToken);
                 this.cancelReservation(idCar);
             });
     }
     else
       console.error('Інша помилка:LocationtenantService cancelReservation Скасувати бронювання авто', error);

        throw error; // Передаємо помилку далі
    })
).subscribe(
  (response:  TenantCars[]) => {
    this.carsWaiting = [];
        for(let i=0;i<response.length;i++)
        {
          let status="";
          if(response[i].status!="1")
          status="В очікуванні";
        else
          status="Підтверджено";

          response[i].status=status;
          this.carsWaiting.push(response[i])
        }
  },
  (error) => {
      console.error("Інша помилка:LocationtenantService cancelReservation Скасувати бронювання авто subscribe", error);
  }
  );

  }

  // повертаємо локацію клієнта
   getUserLocation(): Promise<UserLocation> {
    if ("geolocation" in navigator) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = new UserLocation(position.coords.latitude, position.coords.longitude);
            resolve(userLocation);
          },
          (error) => {
            console.error("Помилка отримання геолокації:", error);
            // В разі помилки ви можете також повернути дефолтні координати
            resolve(new UserLocation(50.4500336,30.5241491));
          }
        );
      });
    } else {
      // Якщо геолокація не підтримується, повертаємо дефолтні координати
      return Promise.resolve(new UserLocation(50.4500336,30.5241491));
    }
  }

  //получити информацию про геолокацію по координатам
  getAddressByCoordinates(lat: number, lon: number): void {
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${myKeyGoogle}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Помилка запиту до сервера Google Maps');
        }
        return response.json();
      })
      .then((data) => {
        if (data.results && data.results.length > 0) {
          this.clickAddress = data.results[0].formatted_address;
        } else {
          throw new Error('Адресу не знайдено');
        }
      })
      .catch((error) => {
        console.error('Помилка отримання адреси:', error);
      });
  }

 // Завантаження маркерів на карту
  loadMarkers(map: Map | undefined): void {
    if (map) {
      for (let i = 0; i < this.markerResponse?.length; i++) {
        const dateFrom =  this.locationService.dateTransform(this.markerResponse[i].dateFrom)
        const dateTo =  this.locationService.dateTransform(this.markerResponse[i].dateTo)
        const userEmail=localStorage.getItem("userEmail");
        let marker =null;

        if(userEmail===this.markerResponse[i].userEmail)
        {
          marker = new Marker({ color: this.markerResponse[i].color })
          .setLngLat([this.markerResponse[i].lng, this.markerResponse[i].lat])
          .setPopup(
            new Popup().setHTML(

              `<div class="indexMarkerBlock">`+
              `<p class="indexMarkerBrand" >${this.markerResponse[i].brand}</p>` +
              `<p class="indexMarkerModel">${this.markerResponse[i].model}</p>` +
              `<img class="indexMarkerFoto" src='${this.lessorService.carFotoPath + this.markerResponse[i].foto}'>` +
              `<div class="indexMarkerDateBlock">`+
              `<p class="indexMarkerDate" > c ${dateFrom} </p>` +
              `<p class="indexMarkerDate" > по ${dateTo}</p>` +
              `</div>`+
              `<div class="indexMarkerPriceAgeBlock">`+
              `<p class="indexMarkerPriceAge" > ${this.markerResponse[i].price} грн</p>` +
              `<p class="indexMarkerPriceAge" > ${this.markerResponse[i].age} р</p>` +
              `</div>`+
              `</div>`

            )
          )
          .addTo(map);
        }
        else
        {

          marker = new Marker({ color: this.markerResponse[i].color })

          .setLngLat([this.markerResponse[i].lng, this.markerResponse[i].lat])
          .setPopup(
            new Popup().setHTML(

              `<div class="indexMarkerBlock">`+
              `<p class="indexMarkerBrand" >${this.markerResponse[i].brand}</p>` +
              `<p class="indexMarkerModel">${this.markerResponse[i].model}</p>` +
              `<img class="indexMarkerFoto" src='${this.lessorService.carFotoPath + this.markerResponse[i].foto}'>` +
              `<div class="indexMarkerDateBlock">`+
              `<p class="indexMarkerDate" > c ${dateFrom} </p>` +
              `<p class="indexMarkerDate" > по ${dateTo}</p>` +
              `</div>`+
              `<div class="indexMarkerPriceAgeBlock">`+
              `<p class="indexMarkerPriceAge" > ${this.markerResponse[i].price} грн</p>` +
              `<p class="indexMarkerPriceAge" > ${this.markerResponse[i].age} р</p>` +
              `</div>`+
              `<div>`+
              `<button class="btn btn-primary indexMarkerBtn" id="indexMarkerBtnRent-${i}" type="button">Орендувати</button>`+
              `<button class="btn btn-success indexMarkerBtn" id="indexMarkerBtnSend-${i}" type="button"><i class="bi bi-envelope"></i></button>`+
              `</div>`+
              `</div>`

            )
          )
          .addTo(map);
        }


          this.markers.push(marker)
        // обробник події "click" на маркер
         marker.getElement().addEventListener('click', () => {
          //  пауза перед виконанням коду
          setTimeout(() => {
            //новий обробник події на кнопку
            const button = document.getElementById(`indexMarkerBtnRent-${i}`);
            button?.addEventListener('click', () => this.rentCar(this.markerResponse[i]));
            const buttonSend = document.getElementById(`indexMarkerBtnSend-${i}`);
            buttonSend?.addEventListener('click', () => this.Send(this.markerResponse[i]));
          }, 100);

        });

      }
    }
  }


  rentCar(i:MarkerResponse)
  {

    const result = window.confirm("Чи ви впевнені, що бажаєте продовжити?");
      if (result) {
        if(i.idCar)
            this.reserveCar(i.idCar);
        else
            console.log("rentCar no id")
      }
  }

 // Бронювання авто
  reserveCar(idCar:string)
{
    const accessToken = localStorage.getItem('AccessToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });


    return this.http.post< TenantCars[]>(CarController+`reserve?idCar=${idCar}&tenantEmail=${accessToken}`, null, { headers }).pipe(

      catchError((error: any) => {
        if (error.status === 401)
        {
                //якщо токен застарілий
               this.auth.RefreshToken().subscribe((authResponse: TokenModel) => {
                   localStorage.setItem("AccessToken", authResponse.accessToken);
                   localStorage.setItem("RefreshToken", authResponse.refreshToken);
                   this.reserveCar(idCar);
               });
       }
       else
         console.error('reserveCar Інша помилка:LocationtenantService', error);
          throw error; // Передаємо помилку далі
      })
  ).subscribe(
    (response:  TenantCars[]) => {
      this.carsWaiting = [];
          for(let i=0;i<response.length;i++)
          {
            let status="";
            if(response[i].status!="1")
            status="В очікуванні";
          else
            status="Підтверджено";

            response[i].status=status;
            this.carsWaiting.push(response[i])
          }
    },
    (error) => {
        console.error("LocationtenantService Помилка при обробці відповіді на запит оновлення аватара reserveCar: subscribe", error);
    }
    );
}
Send(choiceCar:MarkerResponse)
{
  localStorage.setItem("choiceCar",choiceCar.idCar)
  this.messagesService.choiceCar=choiceCar;
  // this.router.navigate(['message'])
  this.mrouterService.router("message")
}

 destroy(map: Map ) {
    map.remove();
  }

  getMyReserve()
  {
    const accessToken = localStorage.getItem('AccessToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });


    return this.http.post< TenantCars[]>(CarController+`get-my-reserve?tenantEmail=${accessToken}`, null, { headers }).pipe(

      catchError((error: any) => {
        if (error.status === 401)
        {
              //якщо токен застарілий
             this.auth.RefreshToken().subscribe((authResponse: TokenModel) => {
                 localStorage.setItem("AccessToken", authResponse.accessToken);
                 localStorage.setItem("RefreshToken", authResponse.refreshToken);
               this.getMyReserve();
             });
       }
       else
         console.error('Інша помилка: LocationtenantService getMyReserve', error);
          throw error; // Передаємо помилку далі
      })
  ).subscribe(
    (response:  TenantCars[]) => {
      this.carsWaiting=[];
          for(let i=0;i<response.length;i++)
          {
            let status="";
            if(response[i].status!="1")
            status="Очікує";
          else
            status="Підтверджено";

            response[i].status=status;
            this.carsWaiting.push(response[i])
          }
    },
    (error) => {
        console.error("Інша помилка: LocationtenantService getMyReserve subscribe", error);
    }
    );
  }

  clearMap() {
    if (this.map) {
      for (const marker of this.markers) {
        marker.remove();
      }
    }
  }

  filter(filter: Filter){
    const accessToken = localStorage.getItem('AccessToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

     this.http.post<MarkerResponse[]>(MarkerController+"filter", filter, { headers }).pipe(

      catchError((error: any) => {
        if (error.status === 401)
        {
                //якщо токен застарілий
               this.auth.RefreshToken().subscribe((authResponse: TokenModel) => {
                   localStorage.setItem("AccessToken", authResponse.accessToken);
                   localStorage.setItem("RefreshToken", authResponse.refreshToken);
                   this.filter(filter);
               });
       }
       else
         console.error('Інша помилка:', error);

          throw error; // Передаємо помилку далі
      })
  ).subscribe(
    (response:  MarkerResponse[]) => {
      this.markerResponse = [];       //очищення масиву
      this.markerResponse =response;  //призначаємо новий масив з відповіді від сервера
      console.log(response)
      this.clearMap()                 //очищення карти від маркерів
      this.loadMarkers(this.map)      //завантажуємо нові маркери на карту
    },
    (error) => {
        console.error("LocationtenantService Помилка при обробці відповіді на запит фільтрації:", error);
    }
    );
  }
}

