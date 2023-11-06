import { Injectable } from '@angular/core';
import { Map, Marker,Popup } from 'maplibre-gl';
import { HttpClient } from '@angular/common/http';
import { Location,UserLocation } from '../map/model/Location';
import { catchError } from 'rxjs/operators';
import { myKeyGoogle } from '../data/key';
import { LatLng, MarkerResponse } from '../model/interfaces';
import { LessorService } from './lessor.service';


@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient, private lessorService:LessorService) { }
  addresses: Location[] = [];
  location: Location | null = null;
  error:string="";
  clickAddress!: "";
  latLng: LatLng = { lat: 0, lng: 0 };
  markerResponse!: MarkerResponse[] ;



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


// Метод для обробки події відправки форми
 submit(titleControl: string,map: Map) {
  const title = titleControl.toLowerCase();
  this.location = this.addresses.find( (location) => location.name.toLowerCase() === title ) || null;
  if (this.location) {
    this.addMarker(map);
    this.error='';
  } else {
    this.error='Місто не знайдено!';
  }
}

 //Оновлення виду карти на основі обраної локації
  private addMarker(map: Map) {
    if (this.location) {
      const lat = parseFloat(this.location.lat);
      const lon = parseFloat(this.location.lon);
      new Marker({ color: "#FF0000" })
      .setLngLat([lon, lat])
      .addTo(map);
      map.setCenter([lon, lat]);
      map.setZoom(12);
    }
  }


  onInputLocations(event: Event) :void{
    const inputElement = event.target as HTMLInputElement; // Вказуємо, що target є HTMLInputElement
    const searchText = inputElement.value.toLowerCase();
    this.addresses = [];
    if (searchText.length >= 0) {
      this.searchLocations(searchText).subscribe((response: any) => {
        if (response && response.length > 0) {
          const features: any[] = response;
          this.addresses = features.map((feature) => feature);
        }
      });
    } else {
      this.addresses = [];
    }
  }

  searchLocations(query: string) {

    const url = 'https://nominatim.openstreetmap.org/search?format=json&q=';
    // debugger;
    return this.http.get<Location[]>(url + query)
    .pipe(
      catchError((error) =>
      {
        console.error('An error occurred:', error);
        throw error;
      })
    );
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
        console.error('Помилка googleapis отримання адреси:', error);
      });
  }
dateTransform(date:Date):string
{
const dateFrom = new Date(date);
const day = dateFrom.getDate();
const month = dateFrom.getMonth() + 1;
const year = dateFrom.getFullYear();
const formattedDate = `${day}-${month}-${year}`;
return formattedDate;
}

// Завантаження маркерів на карту
  loadMarkers(map: Map | undefined): void {
    if (map) {
      for (let i = 0; i < this.markerResponse?.length; i++) {
        const dateFrom =  this.dateTransform(this.markerResponse[i].dateFrom)
        const dateTo =  this.dateTransform(this.markerResponse[i].dateTo)

        const marker = new Marker({ color: this.markerResponse[i].color })
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
    }
  }

  destroy(map: Map ) {
    map.remove();
  }

setLocation(lat:number, lng:number)
{
  this.latLng.lat=lat;
  this.latLng.lng=lng;
}
getLocation():LatLng
{
  return this.latLng;
}
}
