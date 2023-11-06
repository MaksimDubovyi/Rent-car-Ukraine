import { Injectable } from '@angular/core';
import { Map,  Marker} from 'maplibre-gl';
import { UserLocation } from '../map/model/Location';
import {  myKeyGoogle } from '../data/key';
import { LatLng, MarkerResponse } from '../model/interfaces';

@Injectable({
  providedIn: 'root',
})
export class LocationlessarService {
  constructor() {}
   markerResponse: MarkerResponse[] | null = null;
  clickAddress!: '';
  latLng: LatLng = { lat: 0, lng: 0 };
  private marker: maplibregl.Marker | null = null;
  map: Map | undefined;


  // повертаємо локацію клієнта
  getUserLocation(): Promise<UserLocation> {
    if ('geolocation' in navigator) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = new UserLocation(
              position.coords.latitude,
              position.coords.longitude
            );
            resolve(userLocation);
          },
          (error) => {
            console.error('Помилка отримання геолокації клієнта:', error);
            // В разі помилки ви можете також повернути дефолтні координати
            resolve(new UserLocation(50.4500336, 30.5241491));
          }
        );
      });
    } else {
      // Якщо геолокація не підтримується, повертаємо дефолтні координати
      return Promise.resolve(new UserLocation(50.4500336, 30.5241491));
    }
  }



  destroy(map: Map) {
    map.remove();
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
  getClickAddress()
{
  return this.clickAddress;
}

  //Оновлення виду карти на основі обраної локації
  addMarker(map: Map) {
    if (this.latLng) {
      const lat = parseFloat(this.latLng.lat.toString());
      const lon = parseFloat(this.latLng.lng.toString());

      //видаляємо маркер
      this.marker?.remove();

      //створюємо новий маркер та зберігаємо на нього посилання і додаємо на карту
      this.marker = new Marker({ color: '#FF0000' })
        .setLngLat([lon, lat])
        .addTo(map);
      map.setCenter([lon, lat]);
    }
  }

  setLocation(lat: number, lng: number, map?: Map) {

    this.latLng.lat = lat;
    this.latLng.lng = lng;
    if (map) {
      this.addMarker(map);
    }
  }

  getLocation(map?: Map): LatLng {
    return this.latLng;
  }
}
