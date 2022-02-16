import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Customer } from "../models/customer";
import {
  UserCustomer,
  AuthorizedUser,
  UserService,
} from "../services/user.service";

@Component({
  selector: "app-nav-menu",
  templateUrl: "./nav-menu.component.html",
  styleUrls: ["./nav-menu.component.css"],
})
export class NavMenuComponent implements OnInit {
  isExpanded = false;
  authorizedUser: AuthorizedUser;
  TeamName: string;

  constructor(
    public userService: UserService,
    private activedRoute: ActivatedRoute
  ) {}
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
      this.userService
        .GetMyCustomerByEmail(this.userService.getAuthorizedUserEmail())
        .subscribe((res: Customer) => {
          this.TeamName = res.CustomerName;
        });
    }
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
