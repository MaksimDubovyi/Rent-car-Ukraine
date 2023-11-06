import { Injectable } from '@angular/core';
import { TokenModel, myCar } from '../model/interfaces';
import { CarController, CarFotoPath } from '../data/key';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  catchError} from 'rxjs';
import { UserAuthServiceService } from './user-auth-service.service';
import { MrouterService } from './mrouter.service';

@Injectable({
  providedIn: 'root'
})
export class LessorService {

  constructor(private mrouterService:MrouterService, private http: HttpClient,private auth:UserAuthServiceService) { }//private router: Router,

  myCar: myCar[] = [];
  carFotoPath:string=CarFotoPath;

  // Отримати мої авто
  getMyCar()
  {
       const  headers = new HttpHeaders({
          Authorization: `Bearer ${localStorage.getItem('AccessToken')}`,
        });
         this.http.post<myCar[]>(CarController+`get-my-car?accessToken=${localStorage.getItem('AccessToken')}`, null, { headers }).pipe(
          catchError((error: any) => {
            if (error.status === 401)
            {
                   //якщо токен застарілий
                  this.auth.RefreshToken().subscribe((authResponse: TokenModel) => {
                      localStorage.setItem("AccessToken", authResponse.accessToken);
                      localStorage.setItem("RefreshToken", authResponse.refreshToken);
                    this.getMyCar();
                  });
           }
           else
             console.error('LessorService Інша помилка: getMyCar', error);
              throw error; // Передаємо помилку далі
          })
      ).subscribe(
        (response: myCar[]) => {
          let myCarResponse=response;
              for(let i=0;i<myCarResponse.length;i++)
              {
                  if(myCarResponse[i].status=="0")
                  myCarResponse[i].status='Вільна';
                  else if(myCarResponse[i].status=="1")
                  myCarResponse[i].status='Підтверджено';
                  else if(myCarResponse[i].status=="2")
                  myCarResponse[i].status= 'Очікує підтвердження';
                  else if(myCarResponse[i].status=="3")
                  myCarResponse[i].status= 'Замовлення';
              }
                this.myCar=myCarResponse;
        },
        (error) => {
            console.error("LessorService Помилка при обробці відповіді на запит getMyCar: subscribe", error);
        }
    );
  }

  // Підтвердити оренду
  ConfirmRent(idCar:string)
  {
    const accessToken = localStorage.getItem('AccessToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });


    return this.http.post<myCar>(CarController+`confirm-rent?idCar=${idCar}`, null, { headers }).pipe(

      catchError((error: any) => {
        if (error.status === 401)
        {
                //якщо токен застарілий
               this.auth.RefreshToken().subscribe((authResponse: TokenModel) => {
                   localStorage.setItem("AccessToken", authResponse.accessToken);
                   localStorage.setItem("RefreshToken", authResponse.refreshToken);
                   this.ConfirmRent(idCar);
               });
       }
       else
         console.error('LessorService Інша помилка: ConfirmRent   Підтвердити оренду', error);
         localStorage.clear();
        // this.router.navigate(['/'])
        this.mrouterService.router("main")
          throw error; // Передаємо помилку далі
      })
  ).subscribe(
    (response: myCar) => {
      // Знаходимо елемент в масиві, де idCar співпадає з idToMarkAsOccupied
     const carToMarkAsOccupied = this.myCar.find(car => car.id === response.id);

      if (carToMarkAsOccupied) {
        carToMarkAsOccupied.status = "Підтверджено";
      }
    },
    (error) => {
        console.error("LessorService Помилка при обробці відповіді на запит ConfirmRent: subscribe", error);
    }
    );
  }

  // Скасувати оренду
  CancelmRent(idCar:string)
  {
    const accessToken = localStorage.getItem('AccessToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.post<myCar>(CarController+`cancelm-rent-lessor?idCar=${idCar}`, null, { headers }).pipe(

      catchError((error: any) => {
        if (error.status === 401)
        {
                //якщо токен застарілий
               this.auth.RefreshToken().subscribe((authResponse: TokenModel) => {
                   localStorage.setItem("AccessToken", authResponse.accessToken);
                   localStorage.setItem("RefreshToken", authResponse.refreshToken);
                   this.CancelmRent(idCar);
               });
       }
       else
         console.error('LessorService Інша помилка: CancelmRent', error);
         localStorage.clear();
        //  this.router.navigate(['/'])
        this.mrouterService.router("main")
          throw error; // Передаємо помилку далі
      })
  ).subscribe(
    (response: myCar) => {
      // Знаходимо елемент в масиві, де idCar співпадає з response.id
     const carToMarkAsOccupied = this.myCar.find(car => car.id === response.id);
      if (carToMarkAsOccupied) {
        carToMarkAsOccupied.status = "Вільна";
      }
    },
    (error) => {
        console.error("LessorService Помилка при обробці відповіді на запит CancelmRent: subscribe", error);
    }
    );
  }
}
