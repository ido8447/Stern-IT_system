import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthorizedUser, UserService } from "../../services/user.service";

@Component({
  selector: "app-reports",
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.css"],
})
export class ReportsComponent implements OnInit {
  authorizedUser: AuthorizedUser;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.authorizedUser$.subscribe(
      (authorizedUser: AuthorizedUser) => {
        this.authorizedUser = authorizedUser;
      }
    );

    if (localStorage.getItem("token")) {
      this.authorizedUser = {
        Email: this.userService.getAuthorizedUserEmail(),
      };
    }
  }

  
}
