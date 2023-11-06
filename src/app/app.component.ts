import { Component } from '@angular/core';
import { MrouterService } from './services/mrouter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

constructor(public mrouterService:MrouterService){}

  title = 'RCAR';
}
