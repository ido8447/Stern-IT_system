import { Component } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(public userService: UserService){

  }

  homePage(){
    let url = window.location.pathname;
    console.log(url);
    
    if(url==="/" ){
      return false;
    }
    return true;
  }

 
 
}
