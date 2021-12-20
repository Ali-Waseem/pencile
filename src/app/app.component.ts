import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from './services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pencil';
  constructor(
    private global: GlobalService,
    private route: Router,
  ){
    let alreadyLoggedIn = localStorage.getItem("userData")
    if(alreadyLoggedIn !== null){
      this.global.userData = JSON.parse(alreadyLoggedIn)
      this.route.navigateByUrl('canvas')
    } else {
      this.route.navigateByUrl('login')
    }
  }

}
