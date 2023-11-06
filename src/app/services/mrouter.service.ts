import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MrouterService {

  constructor() { }

  back:boolean=false;
  exit:boolean=false;
thisBrowser:boolean=false;
thisWindowWidth:boolean=false;
 main:boolean=true;
 lessor:boolean=false;
 message:boolean=false;
 personalcabinet:boolean=false;
 login:boolean=false;
 infcar:boolean=false;
 messagelist:boolean=false;
 register:boolean=false;
 selection:boolean=false;
 tenant:boolean=false;

 router(path:string)
 {

  if(path=="main")
    this.main=true;
  else
    this.main=false;

    if(path=="lessor")
    this.lessor=true;
  else
    this.lessor=false;

    if(path=="message")
    this.message=true;
  else
    this.message=false;

    if(path=="personalcabinet")
    this.personalcabinet=true;
  else
    this.personalcabinet=false;

    if(path=="login")
    this.login=true;
  else
    this.login=false;

    if(path=="infcar")
    this.infcar=true;
  else
    this.infcar=false;

    if(path=="messagelist")
    this.messagelist=true;
  else
    this.messagelist=false;

    if(path=="register")
    this.register=true;
  else
    this.register=false;

    if(path=="selection")
    this.selection=true;
  else
    this.selection=false;

    if(path=="tenant")
    this.tenant=true;
  else
    this.tenant=false;
 }

 browser():void
 {
  const userAgent = window.navigator.userAgent;
  let browser = 'unknown';

  // Розпізнавання браузера
  if (/ucbrowser/i.test(userAgent)) {
    browser = 'UCBrowser';
  } else if (/edg/i.test(userAgent)) {
    browser = 'Edge';
  } else if (/googlebot/i.test(userAgent)) {
    browser = 'GoogleBot';
  } else if (/chromium/i.test(userAgent)) {
    browser = 'Chromium';
  } else if (/firefox|fxios/i.test(userAgent) && !/seamonkey/i.test(userAgent)) {
    browser = 'Firefox';
  } else if (/; msie|trident/i.test(userAgent) && !/ucbrowser/i.test(userAgent)) {
    browser = 'IE';
  } else if (/chrome|crios/i.test(userAgent) && !/opr|opera|chromium|edg|ucbrowser|googlebot/i.test(userAgent)) {
    browser = 'Chrome';
  } else if (/safari/i.test(userAgent) && !/chromium|edg|ucbrowser|chrome|crios|opr|opera|fxios|firefox/i.test(userAgent)) {
    browser = 'Safari';
  } else if (/opr|opera/i.test(userAgent)) {
    browser = 'Opera';
  }
  if (/chrome|crios/i.test(userAgent) && !/opr|opera|chromium|edg|ucbrowser|googlebot/i.test(userAgent)) {
    browser = 'Chrome';
  } else if (/safari/i.test(userAgent) && !/chromium|edg|ucbrowser|chrome|crios|opr|opera|fxios|firefox/i.test(userAgent)) {
    browser = 'Safari';
  } else if (/opr|opera/i.test(userAgent)) {
    browser = 'Opera';
  }

  if (/ucbrowser/i.test(userAgent)) {
    browser = 'UCBrowser';
  } else if (/edg/i.test(userAgent)) {
    browser = 'Edge';
  } else if (/googlebot/i.test(userAgent)) {
    browser = 'GoogleBot';
  } else if (/chromium/i.test(userAgent)) {
    browser = 'Chromium';
  } else if (/firefox|fxios/i.test(userAgent) && !/seamonkey/i.test(userAgent)) {
    browser = 'Firefox';
  } else if (/opr|opera/i.test(userAgent)) {
    browser = 'Opera';
  } else if (/; msie|trident/i.test(userAgent) && !/ucbrowser/i.test(userAgent)) {
    browser = 'IE';
  } else if (/chrome|crios/i.test(userAgent) && !/edg|ucbrowser|googlebot/i.test(userAgent)) {
    browser = 'Chrome';
  } else if (/safari/i.test(userAgent) && !/chromium|edg|ucbrowser|chrome|crios|opr|opera|fxios|firefox/i.test(userAgent)) {
    browser = 'Safari';
  }

  if(browser=="Chrome")
  this.thisBrowser= true;
  else
  this.thisBrowser=  false;
 }

 windowWidth():void
 {
  let width= window.innerWidth;
  if(width<800)
  {
    this.thisWindowWidth=true;
  }
  else{
    this.thisWindowWidth=false;
  }
 }
 backR()
 {
   let path=localStorage.getItem("path");
   if(path)
   {

     this.router(path)
     this.back=false;
     if(this.exit===true)
     {     console.log("exit")
      location.reload();
     }
   }
   else{
     console.log("else")
     this.back=false;
   }
 }
}
