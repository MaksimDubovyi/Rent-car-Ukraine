import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Map} from 'maplibre-gl';
import maplibregl from "maplibre-gl";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { myKey } from '../data/key';
import { Location } from '../map/model/Location';
import { LocationlessarService } from '../services/locationlessar.service';
import { MarkerService } from '../services/marker.service';

@Component({
  selector: 'app-maplessor',
  templateUrl: './maplessor.component.html',
  styleUrls: ['./maplessor.component.css']
})
export class MaplessorComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(public locationService:LocationlessarService,private locationlessarService:LocationlessarService) {  }

  map: Map | undefined=this.locationlessarService.map;
  geocoderSelected = false;
  adressRent:string ="";

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  form = new FormGroup({
      address: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3), // Мінімальна довжина для валідації
    ]),
  });



   ngOnInit(): void {}



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

        if(this.locationService.getClickAddress()!==undefined)
        {
          this.locationService.setLocation(e.lngLat.lat,e.lngLat.lng,this.map);
          this.adressRent=this.locationService.getClickAddress();
        }
      });
    // Додайте обробник події на кнопку з використанням індексу i
        // const button = document.getElementById(`btn-0`);
        // button?.addEventListener('click', () => {
        //   this.sendNewPassword(0); // Викликайте вашу стрілкову функцію з індексом в масиві
        // });
    } catch (error) {
      console.error("Помилка при отриманні геолокації:", error);
    }
  }


  ngOnDestroy() {
    this.locationService.destroy(this.map!);
  }
}

