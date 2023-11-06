import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Map} from 'maplibre-gl';
import maplibregl from "maplibre-gl";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {LocationService} from '../services/location.service';
import { myKey } from '../data/key';
import { Location,UserLocation } from './model/Location';
import { MarkerService } from '../services/marker.service';
import { MarkerResponse } from '../model/interfaces';
import bowser from 'bowser';
import { MrouterService } from '../services/mrouter.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {

  map: Map | undefined;
  geocoderSelected = false;
  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  form = new FormGroup({
      address: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3), // Мінімальна довжина для валідації
    ]),
  });

  constructor(public mrouterService:MrouterService,public locationService:LocationService, private markerService:MarkerService) {  }


  screenWidth: number=0;

   ngOnInit(): void {
   this.mrouterService.browser();
   this.mrouterService.windowWidth();
};




  // Метод для обробки події відправки форми
  submit() {
    const titleControl = this.form.get('address'); // Отримати доступ до FormControl за допомогою get()
    if (titleControl && titleControl.valid && titleControl.value !== null) {
      this.locationService.submit(titleControl.value,this.map!);
    }
  }

  // Обробник події вибору адреси зі списку
  onSelect(address: Location) {
    this.form.get('address')?.setValue(address?.name || '');
    this.geocoderSelected = true;
  }



// Обробник події введення тексту
  onInput(event: Event)
  {
    this.geocoderSelected = false;
    this.locationService.onInputLocations(event);

  }


  //ngAfterViewInit - це метод життєвого циклу компонента в Angular. Цей метод викликається після того, як вид (View) компонента та його дочірні
  // елементи (шаблон, HTML) були ініціалізовані та відображені на екрані. Це час, коли ви можете виконати деякі дії з елементами
  //  DOM або виконати інші завдання, які вимагають вже наявного та відображеного DOM.
  async ngAfterViewInit() {
    try {

      const initialState = await this.locationService.getUserLocation();
      this.map = new maplibregl.Map({
        container: this.mapContainer.nativeElement,
        style: `https://api.maptiler.com/maps/streets-v2/style.json?key=` + myKey,
        center: [initialState.lon, initialState.lat],
        zoom:10
      });

      //Обробник події Click (отримання адреси за координатами)
      this.map.on('click', (e) =>{
        this.locationService.getAddressByCoordinates(e.lngLat.lat,e.lngLat.lng);
          // alert(this.locationService.getClickAddress())
      });



      this.markerService.getAllMarkers().subscribe(
        (markerResponse: MarkerResponse[]) => {
         this.locationService.markerResponse=markerResponse;
         this.locationService.loadMarkers(this.map);

        }
      );






    } catch (error) {
      console.error("Помилка при отриманні геолокації:", error);
    }
  }

  sendNewPassword()
  {
    alert("hi")
  }

  ngOnDestroy() {
    localStorage.setItem("path","main")
    this.mrouterService.back=true;
    this.locationService.destroy(this.map!);46.455453477984605
  }
}
