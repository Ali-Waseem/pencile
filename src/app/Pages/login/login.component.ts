import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService, SocialUser } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { User } from 'src/app/Model/user';
import { GlobalService } from 'src/app/services/global.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  GoogleLoginProvider = GoogleLoginProvider;
  constructor(
    private authService: SocialAuthService,
    private global: GlobalService,
    private route: Router,
    ) { }

  ngOnInit(): void {

    this.authService.authState.subscribe(user => {
      if(user && user != null)  {
        let userData : User = {
          id: user.id,
          email: user.email,
          name: user.name
        }
        localStorage.setItem("userData" , JSON.stringify(userData))
        this.global.userData = userData
        this.route.navigate(['canvas'])
      } else {
        this.route.navigate(['login'])
      }
    });

  }

  signIn(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

}
