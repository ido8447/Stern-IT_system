import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Customer } from "src/app/models/customer";
import { User } from "src/app/models/user.model";
import { UserService } from "../../../services/user.service";
import {Location} from '@angular/common';


@Component({
  templateUrl: "details.component.html",
})
export class UserDetailsComponent implements OnInit {
  public user: User;
  public usersCustomer;
  /**
   *
   */
  constructor(
    private router: Router,
    private activedRoute: ActivatedRoute,
    private service: UserService,
    private _location: Location
  ) {}
  ngOnInit() {
    const id = this.activedRoute.snapshot.paramMap.get("id");
    this.service.get(id).subscribe(
      (res) => {
        this.user = res as User;
        
      },
      (error) => {
        console.log(error);
      }
    );

    // this.service.GetCustomerById(this.user.CustomerId).subscribe(res=>{
    //   this.usersCustomer = res,
    //   console.log(res);
      
    // })
  }

public cancel(){
    this.router.navigateByUrl('/users');
}

Back(){
  this._location.back()
}

}
