import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServerAvatarPath, UserController } from '../data/key';
import { UserAuthServiceService } from './user-auth-service.service';
import { AuthResponse, TokenModel, UserShow, requestFile_name } from '../model/interfaces';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private auth: UserAuthServiceService,private http: HttpClient) { }
// Отримати користувача
  getUser()
  {
    let AccessToken = localStorage.getItem('AccessToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AccessToken}`,
    });
    return this.http.post<AuthResponse>(UserController + `get-user?accessToken=${AccessToken}`, null, { headers }).pipe(
      catchError((error: any) => {
        if (error.status === 401)
        {
               //якщо токен застарілий
              this.auth.RefreshToken().subscribe((authResponse: TokenModel) => {
                  localStorage.setItem("AccessToken", authResponse.accessToken);
                  localStorage.setItem("RefreshToken", authResponse.refreshToken);
                this.getUser();
              });
       }
       else
         console.error('UserService getUser Інша помилка:', error);

          throw error; // Передаємо помилку далі
      })
  )
  .subscribe(
      (response: AuthResponse) => {
          this.auth.userShow=new UserShow(response.firstName,response.email,response.emailConfirmCode,response.avatar);
      },
      (error) => {
          console.error("Помилка при обробці відповіді на запит оновлення аватара:", error);
      }
  );

  }
//Оновлення паролю
  updatePassword(password: string) {

    let AccessToken = localStorage.getItem('AccessToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AccessToken}`,
    });
    return this.http.post<string>(UserController + `update-password?password=${password}&accessToken=${AccessToken}`, null, { headers })
  }

  sendNewPassword(email: string) {
    return this.http.post<string>(UserController + `send-new-password?email=${email}`, null)
  }


  // Зберігаємо фото на сервер (сервер для зберігання фото) та повертаємо назву файлу для передачі на інший сервер для збереження в БД
  public fileInputChange(input: HTMLInputElement): void {
    if (input.files != null && input.files.length > 0) {
        const selectedFile = input.files[0];
        if (selectedFile) {
            let fileData = new FormData();
            fileData.append('upload', selectedFile);
            if(this.auth.userShow)
            fileData.append('filename', this.auth.userShow.avatar);
            fileData.append('folder', "avatar");


            this.http.post<requestFile_name>(ServerAvatarPath, fileData)
                .pipe(
                    catchError((error: any) => {
                        // Обробляємо помилку тут
                        console.error("Помилка при відправці файлу:", error);
                        throw error; // Передаємо помилку далі
                    })
                )
                .subscribe((response: requestFile_name) => {
                    // Оновлення аватара після отримання відповіді
                    if (response && response.file_name)
                    {
                      this.updateAvater(response.file_name);}
                },
                (error) => {
                    console.error("Помилка при підписці на відповідь сервера:", error);
                });
        }
    }
}

 // Зберігаємо назву файлу  в БД
updateAvater(namee: string): void {
    let AccessToken = localStorage.getItem('AccessToken');
    const headers = new HttpHeaders({
        Authorization: `Bearer ${AccessToken}`,
    });

    const requestBody = {
       Email: AccessToken,
       FileName: namee
      };

    this.http.post<AuthResponse>(UserController+"update-avatar", requestBody, { headers })
        .pipe(
            catchError((error: any) => {
              if (error.status === 401)
              {
                     //якщо токен застарілий
                    this.auth.RefreshToken().subscribe((authResponse: TokenModel) => {
                        localStorage.setItem("AccessToken", authResponse.accessToken);
                        localStorage.setItem("RefreshToken", authResponse.refreshToken);
                      this.updateAvater(namee);
                    });
             }
             else
               console.error('Інша помилка:', error);
                throw error; // Передаємо помилку далі
            })
        )
        .subscribe(
            (response: AuthResponse) => {
                if(this.auth.userShow)
                this.auth.userShow.avatar= response.avatar;
            },
            (error) => {
                console.error("UserService updateAvater - Помилка при обробці відповіді на запит оновлення аватара:", error);
            }
        );
}
}
