export interface UserAuth
{
  email:string,
  password:string
}


export interface UserRegistr
{
  firstName:string,
  lastName:string,
  email:string,
  phone:string,
  age:string,
  drivingExperience:string,
  password:string,
  confirmPassword:string,
}

export interface User
{
  id:number
  firstName:string,
  lastName:string,
  email:string,
  phone:string,
  age:number,
  drivingExperience:number,
  avatar:string
  password:string,
  confirmPassword:string,
}
export interface AuthResponse {
  firstName: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  emailConfirmCode: string;
  avatar:string;
}
export class  UserShow
{
  firstName:string;
  email:string;
  emailConfirmCode: string;
  avatar:string;

  constructor(firstName:string, email:string, emailConfirmCode: string,avatar:string)
  {
    this.firstName=firstName ;
    this.email=email ;
    this.emailConfirmCode=emailConfirmCode;
    this.avatar=avatar;
  }

}

export interface Car{
  id:string,
  foto:string,                //  фото
  price:number,               //  ціна
  brand:string,               //  марка
  model:string,               //  модель
  age:number,                 //  рік
  climate:boolean,            //  кондиціонер
  door:number,                //  кількість дверей
  color:string,               //  колір
  numberOfSeats:number,       //  кількість місць
  engineCapacity:number,      //  обєм двигуна
  transmissionType:string,    //  Тип трансмісії
  fuelЕype:string,            //  тип палива
  status:string,              //  статус
  dateFrom:string,            //  дата з
  dateTo:string,              //  дата до
  dateСreation:string         //  дата створення
}
//додаваня в список аренди
export interface addRenCar{
  idCar:string,               //  id авто
  dateFrom:string,            //  дата з
  dateTo:string,              //  дата до
  lat:number                 //  Широта (latitude)
  lng:number                 //  довгота (longitude)
}



//для додаваня нового авто
export interface AddCar{

  foto:null,                //  фото
  price:number,               //  ціна
  brand:string,               //  марка
  model:string,               //  модель
  age:number,                 //  рік
  climate:boolean,            //  кондиціонер
  door:number,                //  кількість дверей
  color:string,               //  колір
  numberOfSeats:number,       //  кількість місць
  engineCapacity:number,      //  обєм двигуна
  transmissionType:string,    //  Тип трансмісії
  fuelЕype:string,            //  тип палива

}

//для прийому від сервера та відображення у влясному спису авто готових до здачі в оренду
export interface myCar
{
  id:string,
  brand:string,               //  марка
  climate:boolean,            //  кондиціонер
  color:string,               //  колір
  dateCreation:Date,          //  дата створення
  door: number,               //  кількість дверей
  engineCapacity:number,      //  обєм двигуна
  foto:string,                //  фото
  fuelЕype:string,            //  тип палива
  model:string,               //  модель
  numberOfSeats:number,       //  кількість місць
  price:number,               //  ціна
  status:string,              //  статус
  transmissionType:string,    //  Тип трансмісії
}

export interface CarInf
{
  id:string,
  brand:string,               //  марка
  climate:boolean,            //  кондиціонер
  color:string,               //  колір
  dateCreation:Date,          //  дата створення
  deleteDt:Date,
  door: number,               //  кількість дверей
  engineCapacity:number,      //  обєм двигуна
  foto:string,                //  фото
  fuelEype:string,            //  тип палива
  model:string,               //  модель
  numberOfSeats:number,       //  кількість місць
  price:number,               //  ціна
  status:string,              //  статус
  transmissionType:string,    //  Тип трансмісії
  userEmail:string,
  age:number,
}



//для коорденат
export interface LatLng{
  lat:number,
  lng:number
}

export class  TokenModel
{
  accessToken:string;
  refreshToken:string;
  constructor(accessToken:string,refreshToken:string)
  {
    this.accessToken=accessToken ;
    this.refreshToken=refreshToken ;
  }

}

export interface requestFile_name{
  file_name:string;
}


///  MarkerResponse

export interface MarkerResponse{
  id:string;
  idCar:string;
  dateFrom:Date;
  dateTo:Date;
  lat:number;
  lng:number;
  userEmail:string;
  foto:string;
  price:number;
  brand:string;
  model:string;
  age:number;
  color:string
}



///  TenantCars

export interface TenantCars{
  idCar:string;
  userEmail:string;
  foto:string;
  price:number;
  brand:string;
  model:string;
  status:string,              //  статус
}

// модель для фільтрації
export interface Filter{
  priceFrom?:number;
  priceTo?:number;
  ageFrom?:number;
  ageTo?:number;
  dateFrom?:Date;
  dateTo?:Date;
  climate?:boolean;
  brand?:string;
  model?:string;
  door?:number;
  numberOfSeats?:number;
  transmissionType?:string;
  fuelЕype?:string;
}



// --//--//--//-------MessageResponse

export interface MessageResponse{
  emailUser?:string;
 name?:string;
 txt?:string;
  date?:Date;
}

export interface MessageShow{
  emailUser?:string;
 name?:string;
 txt?:string;
  date?:string;
}


export interface MessageList{
  idCar?:string;
  foto?:string;
  price?:number;
  brand?:string;
  model?:string;
  txt?:string;
  date?:string;
  read?:boolean;
  userLessorId?:string;
  userTenantId?:string;
  online?:boolean;
  showName?:boolean;
}

