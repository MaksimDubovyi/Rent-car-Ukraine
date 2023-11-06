import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserAuthServiceService } from '../services/user-auth-service.service';
import { AutoService } from '../services/auto.service';
import { LessorService } from '../services/lessor.service';
import { Router } from '@angular/router';
import { MrouterService } from '../services/mrouter.service';

@Component({
  selector: 'app-infcar',
  templateUrl: './infcar.component.html',
  styleUrls: ['./infcar.component.css']
})
export class InfcarComponent implements OnInit,OnDestroy {

constructor(public mrouterService:MrouterService,public auth:UserAuthServiceService,public autoService:AutoService,public lessorService:LessorService)//private router: Router
{}

ngOnInit():void
{
  let idCar= localStorage.getItem('idcar')
  if(idCar)
  this.autoService.getCarInf(idCar);
}

ngOnDestroy() {

  localStorage.setItem("path","infcar")
  this.mrouterService.back=true;
}
DeleteCar(idCar:string)
{
  const result = window.confirm("Чи ви впевнені, що бажаєте видалити авто?");
  if (result) {
    this.autoService.deleteCar(idCar);
  }

}


Back()
{
  // this.router.navigate(['/lessor']);
  this.mrouterService.router("lessor")
}

logaut()
{
 this.auth.logout();
}
}
