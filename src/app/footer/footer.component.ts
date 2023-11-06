import { Component } from '@angular/core';
import { MrouterService } from '../services/mrouter.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
constructor (public mrouterService:MrouterService){}
back()
{
  this.mrouterService.backR()
}
}
