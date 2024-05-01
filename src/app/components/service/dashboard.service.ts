import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor() {
  }

  public colors = (alfa: any) => {
    let red = Math.floor(Math.random() * 255);
    let green = Math.floor(Math.random() * 255);
    let blue = Math.floor(Math.random() * 255);

    return `rgba(${red},${green},${blue},${alfa})`;
  }

}
