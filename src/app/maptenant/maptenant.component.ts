import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Map} from 'maplibre-gl';
import maplibregl from "maplibre-gl";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {LocationService} from '../services/location.service';
import { myKey } from '../data/key';
import { Location,UserLocation } from '../map/model/Location';
import { MarkerService } from '../services/marker.service';
import { MarkerResponse } from '../model/interfaces';
import { LocationtenantService } from '../services/locationtenant.service';
import { MrouterService } from '../services/mrouter.service';


@Component({
  selector: 'app-maptenant',
  templateUrl: './maptenant.component.html',
  styleUrls: ['./maptenant.component.css']
})
export class MaptenantComponent implements  AfterViewInit, OnDestroy {

  // map: Map | undefined;
  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  constructor(public mrouterService:MrouterService,public locationtenantService:LocationtenantService, private markerService:MarkerService) {  }


  //ngAfterViewInit - це метод життєвого циклу компонента в Angular. Цей метод викликається після того, як вид (View) компонента та його дочірні
  // елементи (шаблон, HTML) були ініціалізовані та відображені на екрані. Це час, коли ви можете виконати деякі дії з елементами
  //  DOM або виконати інші завдання, які вимагають вже наявного та відображеного DOM.
  async ngAfterViewInit() {
    try {

      const initialState = await this.locationtenantService.getUserLocation();
      this.locationtenantService.map = new maplibregl.Map({
        container: this.mapContainer.nativeElement,
        style: `https://api.maptiler.com/maps/streets-v2/style.json?key=` + myKey,
        center: [initialState.lon, initialState.lat],
        zoom:10
      });

      //Обробник події Click (отримання адреси за координатами)
      this.locationtenantService.map.on('click', (e) =>{
        this.locationtenantService.getAddressByCoordinates(e.lngLat.lat,e.lngLat.lng);
          // alert(this.locationService.getClickAddress())
      });

      this.markerService.getAllMarkers().subscribe(
        (markerResponse: MarkerResponse[]) => {
         this.locationtenantService.markerResponse=markerResponse;
         this.locationtenantService.loadMarkers(this.locationtenantService.map);

        }
      );

    } catch (error) {
      console.error("Помилка при отриманні геолокації:", error);
    }
  }



  ngOnDestroy() {
    this.locationtenantService.destroy(this.locationtenantService.map!);
  }
}
