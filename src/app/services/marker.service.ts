import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserAuthServiceService } from './user-auth-service.service';
import { Observable, catchError } from 'rxjs';
import { MarkerController} from '../data/key';
import {  MarkerResponse, TokenModel,  addRenCar, myCar } from '../model/interfaces';
import { MrouterService } from './mrouter.service';
import { LessorService } from './lessor.service';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {


  constructor(public lessorService:LessorService,private mrouterService:MrouterService,private http: HttpClient,private auth:UserAuthServiceService) { }//private router: Router,


  // Встановлення маркера на карту
  setCarTheMap(addRCar:addRenCar)
  {
    let AccessToken = localStorage.getItem('AccessToken');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${AccessToken}`,
    });

    const requestBody = {
      accessToken: AccessToken,
      idCar: addRCar.idCar,
      dateFrom: addRCar.dateFrom,
      dateTo: addRCar.dateTo,
      lat: addRCar.lat,
      lng: addRCar.lng
    };
    return this.http.post<MarkerResponse>(MarkerController +"create", requestBody, { headers }).pipe(
      catchError((error: any) => {
        if (error.status === 401)
        {
               //якщо токен застарілий
              this.auth.RefreshToken().subscribe((authResponse: TokenModel) => {
                  localStorage.setItem("AccessToken", authResponse.accessToken);
                  localStorage.setItem("RefreshToken", authResponse.refreshToken);
                  console.log(addRCar)
                this.setCarTheMap(addRCar);
              });
       }
       else
         console.error('MarkerService error Встановлення маркера на карту', error);

          throw error; // Передаємо помилку далі
      })
  )
  .subscribe(
      (response: MarkerResponse) => {
        this.lessorService.getMyCar();
      },
      (error) => {
          console.error("Помилка при обробці відповіді на запит оновлення аватара:", error);
      }
  );
  }

  // Видалення маркера з карти
  RemoveFromMap(removeCar:myCar){
    let AccessToken = localStorage.getItem('AccessToken');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${AccessToken}`,
    });


    return this.http.post<MarkerResponse>(MarkerController +"remove-from-map?idCar="+removeCar.id, null, { headers }).pipe(
      catchError((error: any) => {
        if (error.status === 401)
        {
               //якщо токен застарілий
              this.auth.RefreshToken().subscribe((authResponse: TokenModel) => {
                  localStorage.setItem("AccessToken", authResponse.accessToken);
                  localStorage.setItem("RefreshToken", authResponse.refreshToken);

                this.RemoveFromMap(removeCar);
              });
       }
       else
       {console.error('Інша помилка:', error);
        localStorage.clear();
     //   this.router.navigate(['/'])
     this.mrouterService.router("main")
       }


          throw error; // Передаємо помилку далі

      })
  )
  .subscribe(
      (response: MarkerResponse) => {
        this.lessorService.getMyCar();
      },
      (error) => {
          console.error("Помилка MarkerService RemoveFromMap Видалення маркера з карти", error);
      }
  );
  }

  //Одримати  маркери даданих авто на карті
  getAllMarkers(): Observable<MarkerResponse[]> {
    const accessToken = localStorage.getItem('AccessToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.post<MarkerResponse[]>(MarkerController+"get-all-markers", null, { headers }).pipe( );
  }

}
