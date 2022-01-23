import { Component, OnInit } from "@angular/core";
import { UserCustomer, AuthorizedUser, UserService } from "../services/user.service";

@Component({
  selector: "app-nav-menu",
  templateUrl: "./nav-menu.component.html",
  styleUrls: ["./nav-menu.component.css"],
})
export class NavMenuComponent implements OnInit {
  isExpanded = false;
  authorizedUser: AuthorizedUser;
  customer: UserCustomer;

  constructor(private userService: UserService) { }
  ngOnInit(): void {


    this.userService.authorizedUser$.subscribe(
      (authorizedUser: AuthorizedUser) => {
        this.authorizedUser = authorizedUser;
      }
    );

    //if there is a token
    //put on authorizedUser a email from the token
    if (localStorage.getItem("token")) {
      this.authorizedUser = {
        Email: this.userService.getAuthorizedUserEmail(),
      };
      // this.GetMyCustomer();
    }



  }


  GetMyCustomer() {
    this.userService.GetMyCustomerByEmail(this.userService.getAuthorizedUserEmail()).subscribe(res => {
      this.customer ={
        Customer: res.toString(),
      };
      
      console.log(res as string);
    })
  }
  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
