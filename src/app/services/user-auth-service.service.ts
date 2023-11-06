import { Injectable} from '@angular/core';
import {AuthResponse, TokenModel,UserAuth, UserRegistr, UserShow} from '../model/interfaces';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError,tap } from 'rxjs/operators';
import { AvatarPath, PathAuth} from '../data/key';
import { MrouterService } from './mrouter.service';

@Injectable({
  providedIn: 'root',
})
export class UserAuthServiceService {
  constructor(private mrouterService:MrouterService,private http: HttpClient) {}//

  private token: boolean = false;
  public isEmailConfirmCode: boolean = false;

  public userShow!: UserShow | null;
  public avatarPath: string = AvatarPath;

  confirmMail(code: string) {
    if (this.userShow) this.userShow.emailConfirmCode = code;

    return this.http.post<string>(PathAuth + `confirmMail`, this.userShow);
  }

  login(userAuth: UserAuth): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(PathAuth + 'login', userAuth).pipe(
      //тут ми говорим писля запиту виконай деякі дії
      tap(
        //дозволяє забрати щось із стріма
        (authResponse: AuthResponse) => {
          this.userShow = new UserShow(
            authResponse.firstName,
            authResponse.email,
            authResponse.emailConfirmCode,
            authResponse.avatar
          );

          if (this.userShow.emailConfirmCode == null) {
            this.token = true;
            localStorage.setItem('AccessToken', authResponse.accessToken);
            localStorage.setItem('RefreshToken', authResponse.refreshToken);
            localStorage.setItem('userEmail', authResponse.email);
            this.isEmailConfirmCode = false;
            //this.router.navigate(['/personalcabinet']);
            this.mrouterService.router("personalcabinet")
          } else {
            this.isEmailConfirmCode = true;
          }
        }
      ),
      catchError((error: HttpErrorResponse) => {
        if (error.error == 'Bad credentials') {
          console.log('UserAuthServiceService login Користувач не знайдений');
        }
        else{
          console.log('UserAuthServiceService login error');
          alert("Сервер не відповідає! Ведуться технічні роботи спробуйте пізніше дякуємо за розуміння.")
          localStorage.clear();
          // this.router.navigate(['/'])
          this.mrouterService.router("main")
        }

        return throwError(error);
      })
    );
  }

  register(userRegistr: UserRegistr): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(PathAuth + 'register', userRegistr);
  }

  RefreshToken(): Observable<TokenModel> {
    const AccessToken = localStorage.getItem('AccessToken');
    const RefreshToken = localStorage.getItem('RefreshToken');
    if (AccessToken !== null && RefreshToken !== null) {
      const tokenModel = new TokenModel(AccessToken, RefreshToken);

     return this.http.post<TokenModel>(PathAuth + 'refresh-token', tokenModel);
     }
     else
     {
      localStorage.clear();
      // this.router.navigate(['/'])
      this.mrouterService.router("main")
       let tokenNull= new  Observable<TokenModel>;
       return tokenNull;
     }


  }

  isAuthenticated(): boolean {
    return !!this.userShow; //приводимо this.user до boolean
  }

  setToken(token: boolean) {
    this.token = token;
  }

  getToken(): boolean {
    let token = localStorage.getItem('AccessToken');
    if (token != null) {
      this.token = true;
    } else {
      this.token = false;
    }
    return this.token;
  }

  public logout() {
    let AccessToken = localStorage.getItem('AccessToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AccessToken}`,
    });

    this.http
      .post(PathAuth + `revoke?email=${this.userShow?.email}`, null, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            //якщо токен застарілий
            localStorage.clear();
            // this.router.navigate(['/'])
            this.mrouterService.router("main")
              this.RefreshToken().subscribe(
                (authResponse: TokenModel) => {
                  localStorage.setItem('AccessToken', authResponse.accessToken);
                  localStorage.setItem( 'RefreshToken', authResponse.refreshToken );
                  this.logout();
                }
              );

          } else{
             console.error('UserAuthServiceService logout Інша помилка:', error );
             this.userShow = null;
             this.token = false;
             localStorage.clear();
            //  this.router.navigate(['/'])
            this.mrouterService.router("main")
            }


          // Перенаправте помилку наверх для подальшої обробки
          return throwError(error);
        })
      )
      .subscribe(() => {

        this.userShow = null;
        this.token = false;
        localStorage.clear();
        // this.router.navigate(['/']);
        // this.mrouterService.router("main")
        localStorage.setItem("path","main")
        this.mrouterService.back=false;
        this.mrouterService.exit=true;
        this.mrouterService.backR()
      });
  }
}
