import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MapComponent } from './map/map.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RouterModule, Routes } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { AddcarComponent } from './addcar/addcar.component'
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { LessorComponent } from './lessor/lessor.component';
import { TenantComponent } from './tenant/tenant.component';
import { MaplessorComponent } from './maplessor/maplessor.component';
import { MenuselectionComponent } from './menu/menuselection/menuselection.component';
import { FooterComponent } from './footer/footer.component';
import { PersonalcabinetComponent } from './personalcabinet/personalcabinet.component';
import { MaptenantComponent } from './maptenant/maptenant.component';
import { InfcarComponent } from './infcar/infcar.component';

import { MessagesuserComponent } from './messagesuser/messagesuser.component';
import { FooteruserComponent } from './footeruser/footeruser.component';
import { MessagelistComponent } from './messagelist/messagelist.component';

const appRoutes:Routes=[
  {path:' ', component:MapComponent},
  {path:'addcar', component:AddcarComponent},
  {path:'register', component:RegisterComponent},
  {path:'login', component:LoginComponent},
  {path:'lessor', component:LessorComponent},
  {path:'selection', component:MenuselectionComponent},
  {path:'tenant', component:TenantComponent},
  {path:'personalcabinet', component:PersonalcabinetComponent},
  {path:'message', component:MessagesuserComponent},
  {path:'messagelist', component:MessagelistComponent},
  {path:'infcar', component:InfcarComponent},
  {path:'**', component:MapComponent}
]
@NgModule({
  declarations: [

    AppComponent,
    NavbarComponent,
    MapComponent,
    LoginComponent,
    RegisterComponent,
    AddcarComponent,
    LessorComponent,
    TenantComponent,
    MaplessorComponent,
    MenuselectionComponent,
    FooterComponent,
    PersonalcabinetComponent,
    MaptenantComponent,
    InfcarComponent,
    MessagesuserComponent,
    FooteruserComponent,
    MessagelistComponent,

  ],
  imports: [
    ReactiveFormsModule,
    GoogleMapsModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
