import { Injectable } from '@angular/core';
import {  AddCar, TokenModel, requestFile_name, myCar, CarInf } from '../model/interfaces';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable,  throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { UserAuthServiceService } from './user-auth-service.service';
import { CarController, ServerAvatarPath } from '../data/key';
import { LessorService } from './lessor.service';
import { MrouterService } from './mrouter.service';

@Injectable({
  providedIn: 'root',
})
export class AutoService {
  apiService: any;
  constructor(private mrouterService:MrouterService,private http: HttpClient,private auth:UserAuthServiceService, private lessorService:LessorService ) {}//private router: Router,

  tokenModel: TokenModel | null = null;
  fileName:string="";
  fileData!:FormData|null;
  carInf!:CarInf;



  getCarInf(idCar?:string)
{
  const accessToken = localStorage.getItem('AccessToken');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${accessToken}`,
  });


  return this.http.post<CarInf>(CarController+`get-car?idCar=${idCar}`, null, { headers }).pipe(

    catchError((error: any) => {
      if (error.status === 401)
      {
              //якщо токен застарілий
             this.auth.RefreshToken().subscribe((authResponse: TokenModel) => {
                 localStorage.setItem("AccessToken", authResponse.accessToken);
                 localStorage.setItem("RefreshToken", authResponse.refreshToken);
                 this.getCarInf(idCar);
             });
     }
     else
       console.error('AutoService Інша помилка: getCarInf', error);

        throw error; // Передаємо помилку далі
    })
).subscribe(
  (response: CarInf) => {
    this.carInf=response;
  },
  (error) => {
      console.error("AutoService Помилка при обробці відповіді на запит getCarInf: subscribe", error);
  }
  );
}

  addCar(addCar: AddCar): Observable<myCar> {
    return this.tryAddCar(addCar)
    .pipe(
      catchError((error: any) =>
      {
        if (error.status === 401) {
          return this.handleUnauthorizedError(error, addCar);
        } else {
          // Інші помилки
          console.error('AutoService Інша помилка: addCar', error);
          localStorage.clear();
          // this.router.navigate(['/'])
          this.mrouterService.router("main")
          // Передайте помилку далі для подальшої обробки
          return throwError(error);
        }
      })
    );
  }

deleteCar(idCar:string)
{
  const  headers = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('AccessToken')}`,
  });
   this.http.post<myCar[]>(CarController+`delete-car?idCar=${idCar}&accessToken=${localStorage.getItem('AccessToken')}`, null, { headers }).pipe(
    catchError((error: any) => {
      if (error.status === 401)
      {
             //якщо токен застарілий
            this.auth.RefreshToken().subscribe((authResponse: TokenModel) => {
                localStorage.setItem("AccessToken", authResponse.accessToken);
                localStorage.setItem("RefreshToken", authResponse.refreshToken);
              this.deleteCar(idCar);
            });
     }
     else
       console.error('AutoService Інша помилка:deleteCar ', error);
       localStorage.clear();
      //  this.router.navigate(['/'])
      this.mrouterService.router("main")
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
          this.lessorService.myCar=myCarResponse;
          // this.router.navigate(['/lessor']);
          this.mrouterService.router("lessor")
  },
  (error) => {
      console.error("AutoService Помилка при обробці відповіді на запитdeleteCar: subscribe", error);
  }
);
}

  private tryAddCar(addCar: AddCar): Observable<myCar> {
    this.saveFotoServer().pipe()
    const accessToken = localStorage.getItem('AccessToken');
    const formData = new FormData();
    if(accessToken)
    formData.append('accessToken', accessToken);
    formData.append('brand', addCar.brand);
    formData.append('model', addCar.model);
    formData.append('climate', addCar.climate ? 'true' : 'false');
    formData.append('door', addCar.door.toString());
    formData.append('color', addCar.color);
    formData.append('price', addCar.price.toString());
    formData.append('age', addCar.age.toString());
    formData.append('numberOfSeats', addCar.numberOfSeats.toString());
    formData.append('engineCapacity', addCar.engineCapacity.toString());
    formData.append('transmissionType', addCar.transmissionType);
    formData.append('fuelЕype', addCar.fuelЕype);
    formData.append('foto', this.fileName);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });


    return this.http.post<myCar>(CarController+"create", formData, { headers }).pipe(
      tap((addedCar: myCar) => {
        console.log("Відповів сервіс додавання авто:", addedCar);
      })
    );
  }

  //якщо помилка 401 оновити токен і викликати tryAddCar
  private handleUnauthorizedError(error: HttpErrorResponse, addCar: AddCar): Observable<myCar> {
        return this.auth.RefreshToken().pipe(
          switchMap((authResponse: TokenModel) => {
            localStorage.setItem('AccessToken', authResponse.accessToken);
            localStorage.setItem('RefreshToken', authResponse.refreshToken);

            // Повторюємо запит addCar з новим токеном
            return this.tryAddCar(addCar);
          })
        );
    // Додаємо пустий return на завершення методу
    return new Observable<myCar>(); // або інший відповідний за замовчуванням об'єкт
  }

  saveFotoServer():Observable<requestFile_name>
  {
     return this.http.post<requestFile_name>(ServerAvatarPath, this.fileData)
                .pipe(
                    catchError((error: any) => {
                        // Обробляємо помилку тут
                        console.error("Помилка при відправці файлу:", error);
                        throw error; // Передаємо помилку далі
                    })
                )
  }
}
